import { Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);
    const databases = new Databases(client);

    // 3) Verifica se o treinador existe
    const treinador = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (treinador.role !== 'TRAINER' && treinador.role !== 'OWNER') {
      return response({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    // 4) Busca todos os slots do treinador
    const allSlots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
      Query.equal('trainerProfileId', params.id),
      Query.orderAsc('start'),
    ]);

    // 5) Busca todos os bookings existentes
    const allBookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
      Query.equal('status', ['booked', 'attended']),
    ]);

    // 6) Filtra slots que não têm conflitos
    const availableSlots = allSlots.documents.filter((slot) => {
      // Verifica se o slot não tem booking ativo
      const hasBooking = allBookings.documents.some(
        (booking) => booking.evaluationSlots?.$id === slot.$id
      );

      // Verifica se o slot é no futuro (opcional - pode remover se quiser permitir reagendamento para o passado)
      const slotStart = new Date(slot.start);
      const now = new Date();
      const isFuture = slotStart > now;

      return !hasBooking && isFuture;
    });

    // 7) Transforma os dados para o formato esperado
    const slots = availableSlots.map((slot) => ({
      $id: slot.$id,
      start: slot.start,
      end: slot.end,
      location: slot.location,
      tenantId: slot.tenantId,
    }));

    return response({ slots }, STATUS.OK);
  } catch (error) {
    console.error('[Slots Disponíveis]: ', error);
    return response({ message: 'Erro ao buscar slots disponíveis' }, STATUS.ERROR);
  }
}
