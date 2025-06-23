import { Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';
import dayjs from 'dayjs';

import { STATUS, response } from 'src/utils/response';

export const runtime = 'edge';

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
    const data = await request.json();
    const { start, end, excludeSlotId } = data;

    if (!start || !end) {
      return response({ message: 'Horário de início e fim são obrigatórios' }, STATUS.BAD_REQUEST);
    }

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

    const startTime = new Date(start);
    const endTime = new Date(end);

    // 4) Busca slots que podem conflitar - usando lógica mais precisa
    const conflictingSlots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
      Query.equal('trainerProfileId', params.id),
    ]);

    // 5) Filtra slots que realmente conflitam
    const filteredSlots = conflictingSlots.documents.filter((slot) => {
      // Exclui o slot atual se estiver editando
      if (excludeSlotId && slot.$id === excludeSlotId) {
        return false;
      }

      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Verifica se há sobreposição de horários
      // Conflito ocorre quando: (start < slotEnd) && (end > slotStart)
      return startTime < slotEnd && endTime > slotStart;
    });

    // 6) Para cada slot conflitante, verifica se tem booking ativo
    const conflicts = [];
    for (const slot of filteredSlots) {
      const bookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
        Query.equal('evaluationSlots', slot.$id),
        Query.equal('status', ['booked', 'attended']),
      ]);

      if (bookings.documents.length > 0) {
        const booking = bookings.documents[0];
        conflicts.push({
          slotId: slot.$id,
          start: slot.start,
          end: slot.end,
          location: slot.location,
          studentName: booking.memberProfileId?.name || 'Aluno não identificado',
          bookingStatus: booking.status,
        });
      }
    }

    if (conflicts.length > 0) {
      return response(
        {
          hasConflict: true,
          conflicts,
          message: `Conflito detectado com ${conflicts.length} agendamento(s) existente(s)`,
        },
        STATUS.CONFLICT
      );
    }

    return response(
      {
        hasConflict: false,
        message: 'Horário disponível',
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Validar Horário]: ', error);
    return response({ message: 'Erro ao validar horário' }, STATUS.ERROR);
  }
}
