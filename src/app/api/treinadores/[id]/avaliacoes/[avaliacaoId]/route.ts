import { ID, Client, Databases, Query } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';
import dayjs from 'dayjs';

import { STATUS, response as apiResponse } from 'src/utils/response';

import { transformAvaliacao } from 'src/features/treinadores/avaliacao/types/avaliacao';

// Transform Appwrite document to IAvaliacao - keeping consistent with the list endpoint
function transformToIAvaliacao(doc: any): any {
  return {
    Id: doc.$id,
    Status: doc.status,
    DataCheckIn: doc.checkInAt,
    TenantId: doc.tenantId,
    PerfilMembroId: doc.memberProfileId,
    SlotAvaliacaoId: doc.evaluationSlots,
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
    TreinadorId: doc.evaluationSlots?.trainerProfileId?.$id,
  };
}

// Transform metrics to the format expected by the form
function transformMetrics(metrics: any[]): Record<string, number> {
  return metrics.reduce(
    (acc, metric) => {
      if (metric.type && typeof metric.value === 'number') {
        acc[metric.type] = metric.value;
      }
      return acc;
    },
    {} as Record<string, number>
  );
}

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; avaliacaoId: string } }
) {
  // 1) Extrai o header Authorization
  const authHeader = req.headers.get('authorization');
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

    // 3) Verifica se o treinador existe e é um treinador
    const treinador = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (treinador.role !== 'TRAINER' && treinador.role !== 'OWNER') {
      console.log(treinador.role);
      console.log('cai aqui');
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    console.log('Avalição id: ', params.avaliacaoId);

    // 4) Busca a avaliação específica
    const avaliacao = await databases.getDocument(
      'treinup',
      '68227ac1002ddf20d0e8', // Collection de avaliações
      params.avaliacaoId
    );

    // 5) Verifica se a avaliação pertence ao treinador
    if (avaliacao.evaluationSlots.trainerProfileId.$id !== params.id) {
      return apiResponse({ message: 'Avaliação não pertence a este treinador' }, STATUS.FORBIDDEN);
    }

    console.log('params.avaliacaoId: ', params.avaliacaoId);

    // 6) Busca as métricas relacionadas a esta avaliação usando Query
    const metricsResponse = await databases.listDocuments('treinup', '682166bf001a71427a38', [
      Query.equal('evaluationBookings', params.avaliacaoId),
      Query.orderDesc('$createdAt'),
    ]);

    console.log('Metrics found:', metricsResponse.documents.length);
    console.log('Raw metrics:', metricsResponse.documents);

    // Transform metrics to the format expected by the form
    const transformedMetrics = transformMetrics(metricsResponse.documents);

    console.log('avaliacao raw:', avaliacao);
    console.log('transformed metrics:', transformedMetrics);

    // Use our consistent transform function
    const transformedAvaliacao = transformToIAvaliacao(avaliacao);
    console.log('avaliacao transformed:', transformedAvaliacao);

    return apiResponse(
      {
        avaliacao: transformedAvaliacao,
        metrics: transformedMetrics,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Avaliação - get]: ', error);
    return apiResponse({ message: 'Erro ao buscar avaliação' }, STATUS.ERROR);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; avaliacaoId: string } }
) {
  // 1) Extrai o header Authorization
  const authHeader = req.headers.get('authorization');
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

    const data = await req.json();

    console.log('Received data:', JSON.stringify(data, null, 2));

    // 1) Verifica se o treinador existe e é um treinador
    const treinador = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (treinador.role !== 'TRAINER' && treinador.role !== 'OWNER') {
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    // 2) Busca a avaliação existente
    const avaliacaoExistente = await databases.getDocument(
      'treinup',
      '68227ac1002ddf20d0e8',
      params.avaliacaoId
    );

    if (!avaliacaoExistente) {
      return apiResponse({ message: 'Avaliação não encontrada' }, STATUS.NOT_FOUND);
    }

    // 3) Verifica se a avaliação pertence ao treinador
    if (avaliacaoExistente.evaluationSlots.trainerProfileId.$id !== params.id) {
      return apiResponse({ message: 'Avaliação não pertence a este treinador' }, STATUS.FORBIDDEN);
    }

    // 4) Validações - adapta para diferentes formatos de dados
    const memberProfileId = data.PerfilMembroId?.Id || data.PerfilMembroId?.$id;
    let slotId = data.SlotAvaliacaoId?.Id || data.SlotAvaliacaoId?.$id;

    if (!memberProfileId) {
      return apiResponse({ message: 'ID do aluno é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // 5) Verifica se precisa criar um novo slot (horário personalizado)
    if (data.SlotAvaliacaoId && !slotId && data.SlotAvaliacaoId.start && data.SlotAvaliacaoId.end) {
      console.log('Criando novo slot personalizado...');

      // Verifica conflitos de horário
      const startTime = new Date(data.SlotAvaliacaoId.start);
      const endTime = new Date(data.SlotAvaliacaoId.end);

      // Busca slots existentes do treinador que possam conflitar
      const existingSlots = await databases.listDocuments('treinup', '68227a80001b40eaaaec', [
        Query.equal('trainerProfileId', params.id),
        Query.greaterThanEqual('start', startTime.toISOString()),
        Query.lessThanEqual('end', endTime.toISOString()),
      ]);

      // Verifica se algum slot existente tem booking ativo
      for (const slot of existingSlots.documents) {
        const bookings = await databases.listDocuments('treinup', '68227ac1002ddf20d0e8', [
          Query.equal('evaluationSlots', slot.$id),
          Query.equal('status', ['booked', 'attended']),
        ]);

        if (bookings.documents.length > 0) {
          return apiResponse(
            {
              message: `Conflito de horário detectado. Já existe um agendamento entre ${dayjs(slot.start).format('DD/MM/YYYY HH:mm')} e ${dayjs(slot.end).format('HH:mm')}`,
            },
            STATUS.CONFLICT
          );
        }
      }

      // Cria o novo slot
      const newSlot = await databases.createDocument(
        'treinup',
        '68227a80001b40eaaaec',
        ID.unique(),
        {
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          location: data.SlotAvaliacaoId.location || 'Local a definir',
          trainerProfileId: params.id,
          tenantId: treinador.tenantId,
        }
      );

      slotId = newSlot.$id;
      console.log('Novo slot criado:', slotId);
    }

    // 6) Prepara os dados para atualização
    const updateData: any = {
      status: data.Status,
      checkInAt: data.DataCheckIn,
      tenantId: treinador.tenantId,
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
      memberProfileId,
    };

    // Só atualiza o slot se foi fornecido um novo
    if (slotId && slotId !== avaliacaoExistente.evaluationSlots.$id) {
      updateData.evaluationSlots = slotId;
    }

    console.log('Update data:', updateData);

    // 7) Atualiza a avaliação
    const avaliacaoAtualizada = await databases.updateDocument(
      'treinup',
      '68227ac1002ddf20d0e8',
      params.avaliacaoId,
      updateData
    );

    // 8) Se houver medidas, adiciona cada uma na collection Metrics
    if (data.Medidas && typeof data.Medidas === 'object') {
      // Primeiro, remove métricas existentes desta avaliação
      try {
        const existingMetrics = await databases.listDocuments('treinup', '682166bf001a71427a38', [
          Query.equal('evaluationBookings', params.avaliacaoId),
        ]);

        for (const metric of existingMetrics.documents) {
          await databases.deleteDocument('treinup', '682166bf001a71427a38', metric.$id);
        }

        console.log(`Deleted ${existingMetrics.documents.length} existing metrics`);
      } catch (error) {
        console.log('Erro ao deletar métricas existentes:', error);
      }

      // Adiciona as novas métricas
      const metricTypeMap = {
        weight: 'weight',
        height: 'height',
        bmi: 'bmi',
        body_fat_pct: 'body_fat_pct',
        lean_mass_pct: 'lean_mass_pct',
        muscle_mass: 'muscle_mass',
        bone_mass: 'bone_mass',
        body_water_pct: 'body_water_pct',
        bmr: 'bmr',
        metabolic_age: 'metabolic_age',
        visceral_fat: 'visceral_fat',
        waist_circ: 'waist_circ',
        hip_circ: 'hip_circ',
        wh_ratio: 'wh_ratio',
        chest_circ: 'chest_circ',
        arm_circ: 'arm_circ',
        thigh_circ: 'thigh_circ',
        calf_circ: 'calf_circ',
        rest_hr: 'rest_hr',
        bp_systolic: 'bp_systolic',
        bp_diastolic: 'bp_diastolic',
        vo2max: 'vo2max',
        body_temp: 'body_temp',
      };

      for (const [type, value] of Object.entries(data.Medidas)) {
        if (typeof value === 'number' && value > 0) {
          try {
            await databases.createDocument('treinup', '682166bf001a71427a38', ID.unique(), {
              value,
              recordedAt: data.DataCheckIn || new Date().toISOString(),
              tenantId: treinador.tenantId,
              type: metricTypeMap[type as keyof typeof metricTypeMap] || type,
              memberProfileId,
              evaluationBookings: params.avaliacaoId,
            });
          } catch (error) {
            console.log(`Erro ao criar métrica ${type}:`, error);
          }
        }
      }
    }

    return apiResponse(
      {
        message: 'Avaliação atualizada com sucesso',
        avaliacao: transformToIAvaliacao(avaliacaoAtualizada),
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Avaliação - update]: ', error);
    return apiResponse({ message: 'Erro ao atualizar avaliação' }, STATUS.ERROR);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; avaliacaoId: string } }
) {
  // 1) Extrai o header Authorization
  const authHeader = req.headers.get('authorization');
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
    // 1) Verifica se o treinador existe e é um treinador
    const treinador = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (treinador.role !== 'TRAINER' && treinador.role !== 'OWNER') {
      return apiResponse({ message: 'Perfil não é um treinador' }, STATUS.FORBIDDEN);
    }

    // 2) Busca a avaliação existente
    const avaliacaoExistente = await databases.getDocument(
      'treinup',
      '68227ac1002ddf20d0e8',
      params.avaliacaoId
    );

    console.log('AVALIACAO ID: ', params.avaliacaoId);

    if (!avaliacaoExistente) {
      return apiResponse({ message: 'Avaliação não encontrada' }, STATUS.NOT_FOUND);
    }

    // 3) Verifica se a avaliação pertence ao treinador
    if (avaliacaoExistente.evaluationSlots.trainerProfileId.$id !== params.id) {
      return apiResponse({ message: 'Avaliação não pertence a este treinador' }, STATUS.FORBIDDEN);
    }

    // 4) Deleta a avaliação
    await databases.deleteDocument('treinup', '68227ac1002ddf20d0e8', params.avaliacaoId);

    return apiResponse({ message: 'Avaliação excluída com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Avaliação - delete]: ', error);
    return apiResponse({ message: 'Erro ao excluir avaliação' }, STATUS.ERROR);
  }
}
