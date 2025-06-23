import { ID, Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // 1) Extrai o header Authorization
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];
  try {
    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT
    const databases = new Databases(client);

    // Get evaluation slots for the trainer
    const slots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
      Query.equal('trainerProfileId', params.id),
    ]);

    console.log('[Evaluation Slots - GET] Slots encontrados:', {
      total: slots.total,
      slots: slots.documents.map((slot) => ({
        id: slot.$id,
        start: slot.start,
        end: slot.end,
        location: slot.location,
      })),
    });

    // Get all evaluation bookings for these slots
    const bookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
      Query.equal(
        'evaluationSlots',
        slots.documents.map((slot) => slot.$id)
      ),
    ]);

    console.log('[Evaluation Slots - GET] Bookings encontrados:', {
      total: bookings.total,
      bookings: bookings.documents.map((booking) => ({
        id: booking.$id,
        status: booking.status,
        evaluationSlots: booking.evaluationSlots?.$id || booking.evaluationSlots,
        memberProfileId: booking.memberProfileId?.$id || booking.memberProfileId,
      })),
    });

    // Group bookings by slot ID to check their statuses
    const slotBookings = bookings.documents.reduce(
      (acc, booking) => {
        const slotId = booking.evaluationSlots?.$id || booking.evaluationSlots;
        if (!slotId) return acc;

        if (!acc[slotId]) {
          acc[slotId] = [];
        }
        acc[slotId].push(booking.status);
        return acc;
      },
      {} as Record<string, string[]>
    );

    console.log('[Evaluation Slots - GET] Bookings por slot:', slotBookings);

    // Filter out slots that have any non-cancelled bookings
    const availableSlots = slots.documents
      .filter((slot) => {
        const slotStatuses = slotBookings[slot.$id] || [];
        const hasNonCancelledBookings = slotStatuses.some(
          (status: string) => status !== 'cancelled'
        );

        console.log('[Evaluation Slots - GET] Verificando slot:', {
          slotId: slot.$id,
          start: slot.start,
          end: slot.end,
          bookings: slotStatuses,
          hasNonCancelledBookings,
        });

        return !hasNonCancelledBookings;
      })
      .map((slot) => ({
        $id: slot.$id,
        start: slot.start,
        end: slot.end,
        location: slot.location,
      }));

    console.log('[Evaluation Slots - GET] Slots disponíveis:', {
      total: availableSlots.length,
      slots: availableSlots,
    });

    return response(
      {
        slots: availableSlots,
        total: availableSlots.length,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Evaluation Slots - list]: ', error);
    return response({ message: 'Erro ao buscar horários de avaliação' }, STATUS.ERROR);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  // 1) Extrai o header Authorization
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];

  try {
    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);
    const databases = new Databases(client);

    const data = await request.json();

    console.log('[Evaluation Slots - POST] Dados recebidos:', data);

    // Validate required fields
    if (!data.start || !data.end || !data.location) {
      return response(
        { message: 'Data de início, fim e local são obrigatórios' },
        STATUS.BAD_REQUEST
      );
    }

    // Verifica se já existe algum booking ativo para este horário
    const existingBookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
      Query.notEqual('status', 'cancelled'), // Exclui apenas bookings cancelados
    ]);

    console.log('[Evaluation Slots - POST] Bookings existentes:', {
      total: existingBookings.total,
      bookings: existingBookings.documents.map((booking) => ({
        id: booking.$id,
        status: booking.status,
        slotId: booking.evaluationSlots?.$id,
        start: booking.evaluationSlots?.start,
        end: booking.evaluationSlots?.end,
      })),
    });

    const newStart = new Date(data.start);
    const newEnd = new Date(data.end);

    // Primeiro, busca os slots do treinador
    const trainerSlots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
      Query.equal('trainerProfileId', params.id),
    ]);

    // Depois, busca os bookings ativos para esses slots
    const activeBookings = existingBookings.documents.filter((booking) => {
      const slotId = booking.evaluationSlots?.$id || booking.evaluationSlots;
      return trainerSlots.documents.some((slot) => slot.$id === slotId);
    });

    const hasOverlap = activeBookings.some((booking) => {
      const slot = booking.evaluationSlots;
      if (!slot?.start || !slot?.end) return false;

      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      const overlap =
        (newStart >= slotStart && newStart < slotEnd) || // Novo evento começa durante um slot existente
        (newEnd > slotStart && newEnd <= slotEnd) || // Novo evento termina durante um slot existente
        (newStart <= slotStart && newEnd >= slotEnd); // Novo evento engloba um slot existente

      console.log('[Evaluation Slots - POST] Verificando sobreposição:', {
        bookingId: booking.$id,
        status: booking.status,
        slotStart: slot.start,
        slotEnd: slot.end,
        newStart: data.start,
        newEnd: data.end,
        overlap,
      });

      return overlap;
    });

    if (hasOverlap) {
      return response({ message: 'Já existe avaliação ativa nesse horário' }, STATUS.CONFLICT);
    }

    // Create new evaluation slot
    const slot = await databases.createDocument('treinup', '68227a80001b40eaaaec', ID.unique(), {
      start: data.start,
      end: data.end,
      location: data.location,
      trainerProfileId: params.id,
      tenantId: data.tenantId,
    });

    console.log('[Evaluation Slots - POST] Slot criado:', slot);

    // Se for um slot personalizado, criar também o booking
    if (data.custom && data.memberProfileId) {
      const booking = await databases.createDocument(
        'treinup',
        '68227ac1002ddf20d0e8',
        ID.unique(),
        {
          status: 'booked',
          evaluationSlots: slot.$id,
          memberProfileId: data.memberProfileId,
          // trainerProfileId: params.id,
          tenantId: data.tenantId,
          notes: data.observations || '',
          objectives: data.objectives || [],
          restrictions: data.restrictions || [],
          medicalHistory: data.medicalHistory || '',
        }
      );

      console.log('[Evaluation Slots - POST] Booking criado:', booking);

      return response(
        {
          slot,
          booking,
          message: 'Horário personalizado e avaliação criados com sucesso',
        },
        STATUS.CREATED
      );
    }

    return response({ slot }, STATUS.CREATED);
  } catch (error) {
    console.error('[Evaluation Slots - create]: ', error);
    return response({ message: 'Erro ao criar horário de avaliação' }, STATUS.ERROR);
  }
}
