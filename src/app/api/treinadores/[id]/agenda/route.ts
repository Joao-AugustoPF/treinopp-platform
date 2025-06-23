import { Query } from 'appwrite';
import { ID, Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';
import { validatePaginationParams } from 'src/utils/pagination';

import { createSessionClient } from 'src/lib/server/appwrite';
import { TipoEvento } from 'src/features/treinadores/treinador/types/calendar';

// ----------------------------------------------------------------------

export const runtime = 'edge';

const DATABASE_ID = 'treinup';
const PROFILES_COLLECTION_ID = '682161970028be4664f2'; // Profiles collection
const CLASSES_COLLECTION_ID = '6822788f002fef678707'; // Classes collection
const EVALUATION_SLOTS_COLLECTION_ID = '68227a80001b40eaaaec'; // EvaluationSlots collection
const EVALUATION_BOOKINGS_COLLECTION_ID = '68227ac1002ddf20d0e8'; // EvaluationBookings collection

// Add request logging middleware
async function logRequest(request: Request, method: string) {
  console.log(`[${method}] Request received at:`, new Date().toISOString());
  console.log(`[${method}] URL:`, request.url);
  console.log(`[${method}] Method:`, request.method);
  console.log(`[${method}] Headers:`, Object.fromEntries(request.headers.entries()));

  try {
    const clone = request.clone();
    const body = await clone.json();
    console.log(`[${method}] Body:`, body);
  } catch (error) {
    console.log(`[${method}] No body or error parsing body:`, error);
  }
}

// Date validation and transformation utilities
interface DateValidationResult {
  isValid: boolean;
  error?: string;
  startDate?: string;
  endDate?: string;
}

function validateAndTransformDates(data: any): DateValidationResult {
  try {
    console.log('validateAndTransformDates - Input data:', {
      DataInicio: data.DataInicio,
      HoraInicio: data.HoraInicio,
      DataFim: data.DataFim,
      HoraFim: data.HoraFim,
    });

    // Check if required date fields exist
    if (!data.DataInicio || !data.HoraInicio || !data.DataFim || !data.HoraFim) {
      console.log('Missing required date fields:', {
        hasDataInicio: !!data.DataInicio,
        hasHoraInicio: !!data.HoraInicio,
        hasDataFim: !!data.DataFim,
        hasHoraFim: !!data.HoraFim,
      });
      return {
        isValid: false,
        error: 'Data e hora de início e fim são obrigatórios',
      };
    }

    // Parse dates and times
    const startDateStr = data.DataInicio.split('T')[0];
    const [startHours, startMinutes] = data.HoraInicio.split(':');
    const endDateStr = data.DataFim.split('T')[0];
    const [endHours, endMinutes] = data.HoraFim.split(':');

    console.log('Parsed date components:', {
      startDateStr,
      startHours,
      startMinutes,
      endDateStr,
      endHours,
      endMinutes,
    });

    // Create Date objects with time
    const startDate = new Date(`${startDateStr}T${startHours}:${startMinutes}:00.000+00:00`);
    const endDate = new Date(`${endDateStr}T${endHours}:${endMinutes}:00.000+00:00`);

    console.log('Created Date objects:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log('Invalid date format detected');
      return {
        isValid: false,
        error: 'Formato de data ou hora inválido',
      };
    }

    if (endDate <= startDate) {
      console.log('End date is not after start date');
      return {
        isValid: false,
        error: 'A data/hora de término deve ser posterior à data/hora de início',
      };
    }

    // Return dates in ISO 8601 format
    const result = {
      isValid: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    console.log('Final transformed dates:', result);
    return result;
  } catch (error) {
    console.error('Error in validateAndTransformDates:', error);
    return {
      isValid: false,
      error: 'Erro ao processar datas',
    };
  }
}

// Transform Appwrite document to IEvento
function transformToIEvento(doc: any, tipo: TipoEvento, booking?: any) {
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
    AlunoId: tipo === TipoEvento.AVALIACAO ? booking?.memberProfileId : doc.memberProfileId,
    AlunoNome: tipo === TipoEvento.AVALIACAO ? booking?.memberProfile?.name : undefined,
    TipoAula: tipo === TipoEvento.AULA ? doc.type : undefined,
    CapacidadeMaxima: tipo === TipoEvento.AULA ? doc.capacity : undefined,
    VagasDisponiveis:
      tipo === TipoEvento.AULA ? doc.capacity - (doc.bookings?.length || 0) : undefined,
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: false,
    bookingId: tipo === TipoEvento.AVALIACAO ? booking?.$id : undefined,
    isBooking: tipo === TipoEvento.AVALIACAO,
  };
}

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
    const treinadorId = params.id;
    const databases = new Databases(client);

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);
    if (!treinador) {
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    // Parâmetros de paginação
    const { searchParams } = new URL(request.url);
    const validated = validatePaginationParams({
      page: Number(searchParams.get('page')) || 0,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || '',
    });
    const { page = 0, limit = 10 } = validated;

    // Busca e transforma aulas
    const classes = await databases.listDocuments(DATABASE_ID, CLASSES_COLLECTION_ID, [
      Query.equal('trainerProfileId', treinadorId),
      Query.equal('tenantId', treinador.tenantId),
      Query.limit(limit),
      Query.offset(page * limit),
    ]);
    const aulaEvents = classes.documents.map((doc) => transformToIEvento(doc, TipoEvento.AULA));

    // Busca slots de avaliação do treinador
    const slots = await databases.listDocuments(DATABASE_ID, EVALUATION_SLOTS_COLLECTION_ID, [
      Query.equal('trainerProfileId', treinadorId),
      Query.equal('tenantId', treinador.tenantId),
    ]);

    // Para cada slot, busca apenas as avaliações agendadas (status = 'booked')
    const bookedEvaluations = (
      await Promise.all(
        slots.documents.map(async (slot) => {
          const bookings = await databases.listDocuments(
            DATABASE_ID,
            EVALUATION_BOOKINGS_COLLECTION_ID,
            [
              Query.equal('evaluationSlots', slot.$id),
              Query.equal('status', 'booked'),
              Query.limit(100),
            ]
          );

          // Para cada booking, busca o perfil do aluno
          const bookingsWithProfiles = await Promise.all(
            bookings.documents.map(async (booking) => {
              try {
                const memberProfile = await databases.getDocument(
                  DATABASE_ID,
                  PROFILES_COLLECTION_ID,
                  booking.memberProfileId
                );
                return {
                  ...booking,
                  memberProfile,
                };
              } catch (error) {
                console.error('Error fetching member profile:', error);
                return booking;
              }
            })
          );

          return bookingsWithProfiles.map((booking) =>
            transformToIEvento(slot, TipoEvento.AVALIACAO, booking)
          );
        })
      )
    ).flat();

    // Combina e retorna
    const events = [...aulaEvents, ...bookedEvaluations];
    return response({ agenda: events, total: events.length, page, limit }, STATUS.OK);
  } catch (error) {
    console.error('[GET] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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
    const treinadorId = params.id;
    const databases = new Databases(client);

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);

    if (!treinador) {
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    const data = await request.json();

    // Validate required fields
    if (!data.Titulo || !data.Local || !data.TipoEvento) {
      return response('Dados incompletos para criar o evento', STATUS.BAD_REQUEST);
    }

    // Validate and transform dates
    const dateValidation = validateAndTransformDates(data);
    if (!dateValidation.isValid) {
      return response(dateValidation.error || 'Erro na validação de datas', STATUS.BAD_REQUEST);
    }

    let newEvent;

    if (data.TipoEvento === TipoEvento.AULA) {
      // Cria uma nova aula
      newEvent = await databases.createDocument(DATABASE_ID, CLASSES_COLLECTION_ID, ID.unique(), {
        name: data.Titulo,
        type: data.TipoAula,
        start: dateValidation.startDate,
        end: dateValidation.endDate,
        location: data.Local,
        capacity: data.CapacidadeMaxima || 0,
        trainerProfileId: treinadorId,
        tenantId: treinador.tenantId,
        imageUrl: data.imageUrl,
      });
    } else if (data.TipoEvento === TipoEvento.AVALIACAO) {
      // Cria um novo slot de avaliação
      newEvent = await databases.createDocument(
        DATABASE_ID,
        EVALUATION_SLOTS_COLLECTION_ID,
        ID.unique(),
        {
          start: dateValidation.startDate,
          end: dateValidation.endDate,
          location: data.Local,
          trainerProfileId: treinadorId,
          tenantId: treinador.tenantId,
        }
      );
    } else {
      return response('Tipo de evento inválido', STATUS.BAD_REQUEST);
    }

    return response(
      {
        message: 'Evento criado com sucesso',
        evento: transformToIEvento(newEvent, data.TipoEvento),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[POST] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await logRequest(request, 'PUT');

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const eventoId = pathParts[pathParts.length - 1];
    const treinadorId = params.id;

    console.log('[PUT] Processing request for:', {
      eventoId,
      treinadorId,
      pathParts,
    });

    const { databases } = await createSessionClient();
    console.log('[PUT] Appwrite client created');

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);
    console.log('[PUT] Trainer lookup result:', !!treinador);

    if (!treinador) {
      console.log('[PUT] Trainer not found:', treinadorId);
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    const data = await request.json();
    console.log('[PUT] Request data:', data);

    // Validate required fields
    if (!data.Titulo || !data.Local || !data.TipoEvento) {
      console.log('Missing required fields:', {
        hasTitulo: !!data.Titulo,
        hasLocal: !!data.Local,
        hasTipoEvento: !!data.TipoEvento,
      });
      return response('Dados incompletos para atualizar o evento', STATUS.BAD_REQUEST);
    }

    // Validate and transform dates
    const dateValidation = validateAndTransformDates(data);
    if (!dateValidation.isValid) {
      console.log('Date validation failed:', dateValidation.error);
      return response(dateValidation.error || 'Erro na validação de datas', STATUS.BAD_REQUEST);
    }

    // First, try to find the event in the Classes collection
    try {
      const existingClass = await databases.getDocument(
        DATABASE_ID,
        CLASSES_COLLECTION_ID,
        eventoId
      );
      if (existingClass) {
        // Update class
        const updatedEvent = await databases.updateDocument(
          DATABASE_ID,
          CLASSES_COLLECTION_ID,
          eventoId,
          {
            name: data.Titulo,
            type: data.TipoAula,
            start: dateValidation.startDate,
            end: dateValidation.endDate,
            location: data.Local,
            capacity: data.CapacidadeMaxima || 0,
            imageUrl: data.imageUrl,
          }
        );
        return response(
          {
            message: 'Evento atualizado com sucesso',
            evento: transformToIEvento(updatedEvent, TipoEvento.AULA),
          },
          STATUS.OK
        );
      }
    } catch (classError) {
      // If not found in Classes, try EvaluationSlots
      try {
        const existingSlot = await databases.getDocument(
          DATABASE_ID,
          EVALUATION_SLOTS_COLLECTION_ID,
          eventoId
        );
        if (existingSlot) {
          // Update evaluation slot
          const updatedEvent = await databases.updateDocument(
            DATABASE_ID,
            EVALUATION_SLOTS_COLLECTION_ID,
            eventoId,
            {
              start: dateValidation.startDate,
              end: dateValidation.endDate,
              location: data.Local,
            }
          );
          return response(
            {
              message: 'Evento atualizado com sucesso',
              evento: transformToIEvento(updatedEvent, TipoEvento.AVALIACAO),
            },
            STATUS.OK
          );
        }
      } catch (slotError) {
        return response('Evento não encontrado', STATUS.NOT_FOUND);
      }
    }

    return response('Evento não encontrado', STATUS.NOT_FOUND);
  } catch (error) {
    console.error('[PUT] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await logRequest(request, 'DELETE');

  try {
    const url = new URL(request.url);
    const eventoId = url.pathname.split('/').pop();
    const treinadorId = params.id;

    const { databases } = await createSessionClient();

    // Verifica se o treinador existe
    const treinador = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION_ID, treinadorId);

    if (!treinador) {
      return response('Treinador não encontrado', STATUS.NOT_FOUND);
    }

    if (!eventoId) {
      return response('ID do evento não fornecido', STATUS.BAD_REQUEST);
    }

    // Tenta deletar da coleção de aulas
    try {
      await databases.deleteDocument(DATABASE_ID, CLASSES_COLLECTION_ID, eventoId);
      return response({ message: 'Evento excluído com sucesso' }, STATUS.OK);
    } catch (firstError) {
      // Se não encontrar na coleção de aulas, tenta na coleção de slots de avaliação
      try {
        await databases.deleteDocument(DATABASE_ID, EVALUATION_SLOTS_COLLECTION_ID, eventoId);
        return response({ message: 'Evento excluído com sucesso' }, STATUS.OK);
      } catch (secondError) {
        return response('Evento não encontrado', STATUS.NOT_FOUND);
      }
    }
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return response('Internal server error', STATUS.ERROR);
  }
}
