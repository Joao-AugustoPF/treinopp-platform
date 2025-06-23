import type {
  IAvaliacao,
  ISlotAvaliacao,
} from 'src/features/treinadores/avaliacao/types/avaliacao';

import { ID, Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';

// Transform Appwrite document to IAvaliacao
function transformToIAvaliacao(doc: any): IAvaliacao {
  return {
    Id: doc.$id,
    Status: doc.status,
    DataCheckIn: doc.checkInAt,
    TenantId: doc.tenantId,
    PerfilMembroId: {
      Id: doc.memberProfileId?.$id || doc.memberProfileId?.Id || '',
      UserId: doc.memberProfileId?.userId || doc.memberProfileId?.UserId || '',
      Nome: doc.memberProfileId?.name || doc.memberProfileId?.Nome || '',
      AvatarUrl: doc.memberProfileId?.avatarUrl || doc.memberProfileId?.AvatarUrl || '',
      Email: doc.memberProfileId?.email || doc.memberProfileId?.Email || '',
      Role: doc.memberProfileId?.role || doc.memberProfileId?.Role || '',
      Telefone: doc.memberProfileId?.phoneNumber || doc.memberProfileId?.Telefone || '',
      TenantId: doc.memberProfileId?.tenantId || doc.memberProfileId?.TenantId || '',
      Status: doc.memberProfileId?.status || doc.memberProfileId?.Status || '',
    },
    SlotAvaliacaoId: {
      Id: doc.evaluationSlots?.$id || doc.evaluationSlots?.Id || '',
      TenantId: doc.evaluationSlots?.tenantId || doc.evaluationSlots?.TenantId || '',
      DataInicio: doc.evaluationSlots?.start || doc.evaluationSlots?.DataInicio || '',
      DataFim: doc.evaluationSlots?.end || doc.evaluationSlots?.DataFim || '',
      Local: doc.evaluationSlots?.location || doc.evaluationSlots?.Local || '',
      PerfilTreinadorId: {
        Id:
          doc.evaluationSlots?.trainerProfileId?.$id ||
          doc.evaluationSlots?.trainerProfileId?.Id ||
          '',
        UserId:
          doc.evaluationSlots?.trainerProfileId?.userId ||
          doc.evaluationSlots?.trainerProfileId?.UserId ||
          '',
        Nome:
          doc.evaluationSlots?.trainerProfileId?.name ||
          doc.evaluationSlots?.trainerProfileId?.Nome ||
          '',
        AvatarUrl:
          doc.evaluationSlots?.trainerProfileId?.avatarUrl ||
          doc.evaluationSlots?.trainerProfileId?.AvatarUrl ||
          '',
        Email:
          doc.evaluationSlots?.trainerProfileId?.email ||
          doc.evaluationSlots?.trainerProfileId?.Email ||
          '',
        Role:
          doc.evaluationSlots?.trainerProfileId?.role ||
          doc.evaluationSlots?.trainerProfileId?.Role ||
          '',
        Telefone:
          doc.evaluationSlots?.trainerProfileId?.phoneNumber ||
          doc.evaluationSlots?.trainerProfileId?.Telefone ||
          '',
        TenantId:
          doc.evaluationSlots?.trainerProfileId?.tenantId ||
          doc.evaluationSlots?.trainerProfileId?.TenantId ||
          '',
        Status:
          doc.evaluationSlots?.trainerProfileId?.status ||
          doc.evaluationSlots?.trainerProfileId?.Status ||
          '',
      },
      CreatedAt: doc.evaluationSlots?.$createdAt || doc.evaluationSlots?.CreatedAt || '',
      CreatedBy: doc.evaluationSlots?.$createdBy || doc.evaluationSlots?.CreatedBy || '',
      UpdatedAt: doc.evaluationSlots?.$updatedAt || doc.evaluationSlots?.UpdatedAt || '',
      UpdatedBy: doc.evaluationSlots?.$updatedBy || doc.evaluationSlots?.UpdatedBy || '',
      IsDeleted: doc.evaluationSlots?.$isDeleted || doc.evaluationSlots?.IsDeleted || false,
    },
    Observacoes: doc.notes || doc.observacoes || '',
    Objetivos: Array.isArray(doc.objectives)
      ? doc.objectives
      : doc.objectives
        ? [doc.objectives]
        : Array.isArray(doc.objetivos)
          ? doc.objetivos
          : doc.objetivos
            ? [doc.objetivos]
            : [],
    Restricoes: Array.isArray(doc.restrictions)
      ? doc.restrictions
      : doc.restrictions
        ? [doc.restrictions]
        : Array.isArray(doc.restricoes)
          ? doc.restricoes
          : doc.restricoes
            ? [doc.restricoes]
            : [],
    HistoricoMedico: doc.medicalHistory || doc.historicoMedico || '',
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: doc.$isDeleted || false,
  };
}

// Transform Appwrite document to ISlotAvaliacao
function transformToISlotAvaliacao(doc: any): ISlotAvaliacao {
  return {
    Id: doc.$id,
    TenantId: doc.tenantId,
    DataInicio: doc.start,
    DataFim: doc.end,
    Local: doc.location,
    PerfilTreinadorId: doc.trainerProfileId,
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: doc.$isDeleted || false,
  };
}

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

    // Pega os filtros da query string
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get all evaluation slots for this trainer
    const slots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
      Query.equal('trainerProfileId', params.id),
    ]);

    const slotIds = slots.documents.map((slot) => slot.$id);

    // If no slots found, return empty result
    if (slotIds.length === 0) {
      console.log('No evaluation slots found for trainer:', params.id);
      return response(
        {
          avaliacoes: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
        STATUS.OK
      );
    }

    // First, get ALL evaluations to calculate total and apply filters
    const allEvaluationQueries = [
      Query.equal('evaluationSlots', slotIds),
      Query.orderDesc('$createdAt'),
    ];

    if (statusFilter) {
      allEvaluationQueries.push(Query.equal('status', statusFilter));
    } else {
      allEvaluationQueries.push(Query.equal('status', ['booked', 'cancelled', 'attended']));
    }

    console.log('statusFilter: ', statusFilter);
    console.log('search: ', search);
    console.log('dataInicio: ', dataInicio);
    console.log('dataFim: ', dataFim);
    console.log('page: ', page, 'limit: ', limit, 'offset: ', offset);

    // Get all evaluations first (without pagination)
    const allEvaluations = await databases.listDocuments(
      'treinup',
      '68227ac1002ddf20d0e8',
      allEvaluationQueries
    );

    // Transform all Appwrite documents to IAvaliacao
    let allAvaliacoes = allEvaluations.documents.map(transformToIAvaliacao);

    // Apply search filter in memory
    if (search) {
      allAvaliacoes = allAvaliacoes.filter((avaliacao) => {
        const memberName = avaliacao.PerfilMembroId?.Nome || '';
        const memberEmail = avaliacao.PerfilMembroId?.Email || '';
        const location = avaliacao.SlotAvaliacaoId?.Local || '';

        return (
          memberName.toLowerCase().includes(search.toLowerCase()) ||
          memberEmail.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Apply date range filters in memory
    if (dataInicio || dataFim) {
      allAvaliacoes = allAvaliacoes.filter((avaliacao) => {
        const slotDate = new Date(avaliacao.SlotAvaliacaoId?.DataInicio || '');

        if (dataInicio && dataFim) {
          const startDate = new Date(dataInicio);
          const endDate = new Date(dataFim);
          return slotDate >= startDate && slotDate <= endDate;
        } else if (dataInicio) {
          const startDate = new Date(dataInicio);
          return slotDate >= startDate;
        } else if (dataFim) {
          const endDate = new Date(dataFim);
          return slotDate <= endDate;
        }

        return true;
      });
    }

    // Calculate total after all filters
    const totalFiltered = allAvaliacoes.length;
    const totalPages = Math.ceil(totalFiltered / limit);

    // Apply pagination to the filtered results
    const startIndex = offset;
    const endIndex = startIndex + limit;
    const paginatedAvaliacoes = allAvaliacoes.slice(startIndex, endIndex);

    console.log('API Response:', {
      avaliacoes: paginatedAvaliacoes.length,
      total: totalFiltered,
      page,
      limit,
      totalPages,
      startIndex,
      endIndex,
    });

    return response(
      {
        avaliacoes: paginatedAvaliacoes,
        total: totalFiltered,
        page,
        limit,
        totalPages,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Avaliações - list]: ', error);
    return response({ message: 'Erro ao buscar avaliações' }, STATUS.ERROR);
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT
    const databases = new Databases(client);

    const data = await request.json();

    console.log('[Avaliações - create] Received data:', JSON.stringify(data, null, 2));

    // Extract member profile ID (handle both formats)
    const memberProfileId =
      typeof data.PerfilMembroId === 'string'
        ? data.PerfilMembroId
        : data.PerfilMembroId?.Id || data.memberProfileId;

    if (!memberProfileId) {
      return response({ message: 'Perfil do membro é obrigatório' }, STATUS.BAD_REQUEST);
    }

    let slotId = data.SlotAvaliacaoId;

    // Se não tem um slot selecionado, criar um novo slot com horário personalizado
    if (!slotId && (data.DataInicio || data.start) && (data.DataFim || data.end)) {
      const startTime = data.DataInicio || data.start;
      const endTime = data.DataFim || data.end;
      const location = data.Local || data.location || 'Local a definir';

      console.log('[Avaliações - create] Creating custom slot:', {
        startTime,
        endTime,
        location,
        trainerId: params.id,
        tenantId: data.TenantId || data.tenantId,
      });

      // Criar um novo slot de avaliação
      const newSlot = await databases.createDocument(
        'treinup',
        '68227a80001b40eaaaec',
        ID.unique(),
        {
          start: startTime,
          end: endTime,
          location,
          trainerProfileId: params.id,
          tenantId: data.TenantId || data.tenantId,
        }
      );

      slotId = newSlot.$id;
      console.log('[Avaliações - create] Created new slot:', slotId);
    }

    if (!slotId) {
      return response({ message: 'Slot de avaliação é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Verificar se já existe uma avaliação agendada para este slot
    const existingBookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
      Query.equal('evaluationSlots', slotId),
      Query.equal('status', 'booked'),
      Query.limit(1),
    ]);

    if (existingBookings.documents.length > 0) {
      return response({ message: 'Este horário já está ocupado' }, STATUS.CONFLICT);
    }

    // Criar a avaliação
    const evaluation = await databases.createDocument(
      'treinup',
      '68227ac1002ddf20d0e8',
      ID.unique(),
      {
        status: data.Status === 'booked' ? 'booked' : 'booked', // Default to booked
        checkInAt: data.DataCheckIn || null,
        evaluationSlots: slotId,
        memberProfileId,
        tenantId: data.TenantId || data.tenantId,
        notes: data.Observacoes || '',
        objectives: Array.isArray(data.Objetivos)
          ? data.Objetivos
          : data.Objetivos
            ? data.Objetivos.split(',')
                .map((item: string) => item.trim())
                .filter(Boolean)
            : [],
        restrictions: Array.isArray(data.Restricoes)
          ? data.Restricoes
          : data.Restricoes
            ? data.Restricoes.split(',')
                .map((item: string) => item.trim())
                .filter(Boolean)
            : [],
        medicalHistory: data.HistoricoMedico || '',
      }
    );

    console.log('[Avaliações - create] Created evaluation:', evaluation.$id);

    return response(
      {
        message: 'Avaliação criada com sucesso',
        avaliacao: transformToIAvaliacao(evaluation),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Avaliações - create]: ', error);
    return response({ message: 'Erro ao criar avaliação' }, STATUS.ERROR);
  }
}
