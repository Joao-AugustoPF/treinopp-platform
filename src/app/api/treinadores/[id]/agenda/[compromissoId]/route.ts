import { Query } from 'appwrite';

import { STATUS, response } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';
import { TipoEvento } from 'src/features/treinadores/treinador/types/calendar';

// ----------------------------------------------------------------------

export const runtime = 'edge';

const DATABASE_ID = 'treinup';
const PROFILES_COLLECTION_ID = '682161970028be4664f2'; // Profiles collection
const CLASSES_COLLECTION_ID = '6822788f002fef678707'; // Classes collection
const EVALUATION_SLOTS_COLLECTION_ID = '68227a80001b40eaaaec'; // EvaluationSlots collection
const EVALUATION_BOOKINGS_COLLECTION_ID = '68227ac1002ddf20d0e8'; // EvaluationBookings collection
const CLASS_BOOKINGS_COLLECTION_ID = '68216658000f84c0f9b8'; // ClassBookings collection

// Transform Appwrite document to IEvento
function transformToIEvento(doc: any, tipo: TipoEvento) {
  console.log('[Agenda API - PUT] Transformando documento para IEvento:', doc);

  return {
    Id: doc.$id,
    Titulo: tipo === TipoEvento.AULA ? doc.name : 'Avaliação',
    TreinadorId: doc.trainerProfileId,
    DataInicio: doc.start,
    HoraInicio: new Date(doc.start).toTimeString().slice(0, 5),
    DataFim: doc.end,
    HoraFim: new Date(doc.end).toTimeString().slice(0, 5),
    Local: doc.location,
    TipoEvento: tipo,
    TipoAula: tipo === TipoEvento.AULA ? doc.type : undefined,
    CapacidadeMaxima: tipo === TipoEvento.AULA ? doc.capacity : undefined,
    VagasDisponiveis:
      tipo === TipoEvento.AULA ? doc.capacity - (doc.bookings?.length || 0) : undefined,
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: false,
  };
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; compromissoId: string } }
) {
  console.log('[Agenda API - PUT] Request received:', {
    url: request.url,
    method: request.method,
    params,
  });

  try {
    const treinadorId = params.id;
    const compromissoId = params.compromissoId;

    console.log('[Agenda API - PUT] Processing request for:', {
      treinadorId,
      compromissoId,
    });

    const { databases } = await createSessionClient();

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);
    console.log('[Agenda API - PUT] Trainer lookup result:', !!treinador);

    if (!treinador) {
      console.log('[Agenda API - PUT] Trainer not found:', treinadorId);
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    const data = await request.json();
    console.log('[Agenda API - PUT] Request data:', data);

    // Valida dados mínimos necessários
    if (!data.Titulo || !data.DataInicio || !data.HoraInicio || !data.Local || !data.TipoEvento) {
      console.log('[Agenda API - PUT] Missing required fields:', {
        hasTitulo: !!data.Titulo,
        hasDataInicio: !!data.DataInicio,
        hasHoraInicio: !!data.HoraInicio,
        hasLocal: !!data.Local,
        hasTipoEvento: !!data.TipoEvento,
      });
      return response('Dados incompletos para atualizar o evento', STATUS.BAD_REQUEST);
    }

    // Formata as datas para o formato ISO 8601
    const formatDateToISO = (date: string, time: string) => {
      const [hours, minutes] = time.split(':');
      const [year, month, day] = date.split('-');
      return `${year}-${month}-${day}T${hours}:${minutes}:00.000+00:00`;
    };

    const startDate = formatDateToISO(data.DataInicio, data.HoraInicio);
    const endDate = formatDateToISO(
      data.DataFim || data.DataInicio,
      data.HoraFim || data.HoraInicio
    );

    console.log('[Agenda API - PUT] Formatted dates:', {
      startDate,
      endDate,
    });

    // First, try to find the event in the Classes collection
    try {
      console.log('[Agenda API - PUT] Looking for event in Classes collection');
      const existingClass = await databases.getDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        compromissoId
      );
      if (existingClass) {
        console.log('[Agenda API - PUT] Found event in Classes collection, updating...');
        // Update class
        const updatedEvent = await databases.updateDocument(
          DATABASE_ID,
          CLASSES_COLLECTION_ID,
          compromissoId,
          {
            name: data.Titulo,
            type: data.TipoAula,
            start: startDate,
            end: endDate,
            location: data.Local,
            capacity: data.CapacidadeMaxima || 0,
            imageUrl: data.imageUrl,
          }
        );
        console.log('[Agenda API - PUT] Class updated successfully');
        return response(
          {
            message: 'Evento atualizado com sucesso',
            evento: transformToIEvento(updatedEvent, TipoEvento.AULA),
          },
          STATUS.OK
        );
      }
    } catch (classError) {
      console.log('[Agenda API - PUT] Not found in Classes, trying EvaluationSlots');
      // If not found in Classes, try EvaluationSlots
      try {
        const existingSlot = await databases.getDocument(
          DATABASE_ID,
          EVALUATION_SLOTS_COLLECTION_ID,
          compromissoId
        );
        if (existingSlot) {
          console.log('[Agenda API - PUT] Found event in EvaluationSlots, updating...');
          // Update evaluation slot
          const updatedEvent = await databases.updateDocument(
            DATABASE_ID,
            EVALUATION_SLOTS_COLLECTION_ID,
            compromissoId,
            {
              start: startDate,
              end: endDate,
              location: data.Local,
            }
          );
          console.log('[Agenda API - PUT] Evaluation slot updated successfully');
          return response(
            {
              message: 'Evento atualizado com sucesso',
              evento: transformToIEvento(updatedEvent, TipoEvento.AVALIACAO),
            },
            STATUS.OK
          );
        }
      } catch (slotError) {
        console.log('[Agenda API - PUT] Event not found in any collection');
        return response('Evento não encontrado', STATUS.NOT_FOUND);
      }
    }

    return response('Evento não encontrado', STATUS.NOT_FOUND);
  } catch (error) {
    console.error('[Agenda API - PUT] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; compromissoId: string } }
) {
  console.log('[Agenda API - DELETE] Request received:', {
    url: request.url,
    method: request.method,
    params,
  });

  try {
    const treinadorId = params.id;
    const compromissoId = params.compromissoId;
    const { searchParams } = new URL(request.url);
    const isBooking = searchParams.get('isBooking') === 'true';
    const bookingId = searchParams.get('bookingId');

    console.log('isBooking', isBooking);

    console.log('[Agenda API - DELETE] Processing request:', {
      treinadorId,
      compromissoId,
      isBooking,
      bookingId,
    });

    const { databases } = await createSessionClient();

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);
    console.log('[Agenda API - DELETE] Trainer lookup result:', !!treinador);

    if (!treinador) {
      console.log('[Agenda API - DELETE] Trainer not found:', treinadorId);
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    if (isBooking && bookingId) {
      console.log('[Agenda API - DELETE] Processing booking deletion');
      console.log('bookingId', bookingId);

      // First try to get the booking from EvaluationBookings
      let isEvaluation = false;
      try {
        const evaluationBooking = await databases.getDocument(
          DATABASE_ID,
          EVALUATION_BOOKINGS_COLLECTION_ID,
          bookingId
        );
        isEvaluation = !!evaluationBooking;
        console.log('[Agenda API - DELETE] Found evaluation booking:', isEvaluation);
      } catch (error) {
        console.log('[Agenda API - DELETE] Not found in EvaluationBookings, trying ClassBookings');
      }

      // Delete booking
      try {
        if (isEvaluation) {
          // Update evaluation booking status to cancelled
          console.log('[Agenda API - DELETE] Updating evaluation booking status to cancelled');
          await databases.updateDocument(
            DATABASE_ID,
            EVALUATION_BOOKINGS_COLLECTION_ID,
            bookingId,
            {
              status: 'cancelled',
            }
          );
          console.log('[Agenda API - DELETE] Evaluation booking cancelled successfully');
          return response({ message: 'Agendamento cancelado com sucesso' }, STATUS.OK);
        } else {
          // Try to delete from ClassBookings
          console.log('[Agenda API - DELETE] Deleting class booking');
          await databases.deleteDocument(DATABASE_ID, CLASS_BOOKINGS_COLLECTION_ID, bookingId);
          console.log('[Agenda API - DELETE] Class booking deleted successfully');
          return response({ message: 'Agendamento excluído com sucesso' }, STATUS.OK);
        }
      } catch (error) {
        console.error('[Agenda API - DELETE] Error updating/cancelling booking:', error);
        return response('Erro ao cancelar agendamento', STATUS.ERROR);
      }
    }

    // If not a booking, first determine if it's a class
    console.log('[Agenda API - DELETE] Determining event type');
    let isClass = false;

    try {
      const classDoc = await databases.getDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        compromissoId
      );
      isClass = !!classDoc;
      console.log('[Agenda API - DELETE] Found in Classes collection:', isClass);
    } catch (error) {
      console.log('[Agenda API - DELETE] Not found in Classes collection');
    }

    if (!isClass) {
      console.log('[Agenda API - DELETE] Event not found in any collection');
      return response('Evento não encontrado', STATUS.NOT_FOUND);
    }

    // Process class deletion
    console.log('[Agenda API - DELETE] Processing class deletion');
    // Check if there are any bookings for this class
    const classBookings = await databases.listDocuments(DATABASE_ID, CLASS_BOOKINGS_COLLECTION_ID, [
      Query.equal('classId', compromissoId),
    ]);

    if (classBookings.documents.length > 0) {
      console.log('[Agenda API - DELETE] Cannot delete class with existing bookings');
      return response('Não é possível excluir uma aula com agendamentos', STATUS.BAD_REQUEST);
    }

    await databases.deleteDocument(DATABASE_ID, CLASSES_COLLECTION_ID, compromissoId);
    console.log('[Agenda API - DELETE] Class deleted successfully');
    return response({ message: 'Evento excluído com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Agenda API - DELETE] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
