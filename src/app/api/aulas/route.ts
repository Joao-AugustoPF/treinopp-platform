import type { IAula, ITreinadorObject } from 'src/features/aulas/types';

import { ID, Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

// Map Appwrite status to display text
// function mapStatusToDisplay(status: string): string {
//   switch (status) {
//     case 'scheduled':
//       return 'Agendada';
//     case 'confirmed':
//       return 'Confirmada';
//     case 'in_progress':
//       return 'Em Andamento';
//     case 'completed':
//       return 'Concluída';
//     case 'cancelled':
//       return 'Cancelada';
//     case 'no_show':
//       return 'Ausente';
//     default:
//       return 'Agendada';
//   }
// }

// Transform Appwrite document to IAula
function transformToIAula(doc: any): IAula {
  return {
    Id: doc.$id,
    Nome: doc.name,
    TipoAula: doc.type,
    TreinadorId: doc.trainerProfileId,
    DataInicio: doc.start,
    DataFim: doc.end,
    Local: doc.location,
    Capacidade: doc.capacity,
    Status: doc.status || 'scheduled',
    CreatedAt: new Date(doc.$createdAt).toISOString(),
    CreatedBy: doc.$createdBy || 'system',
    UpdatedAt: new Date(doc.$updatedAt).toISOString(),
    UpdatedBy: doc.$updatedBy || 'system',
    IsDeleted: false,
    TenantId: doc.tenantId,
  };
}

// Transform IAula to Appwrite document format
function transformToAppwrite(data: Partial<IAula>) {
  const appwriteData: Record<string, any> = {
    name: data.Nome,
    type: data.TipoAula,
    start: data.DataInicio,
    end: data.DataFim,
    location: data.Local,
    capacity: data.Capacidade,
    status: data.Status || 'scheduled',
    tenantId: data.TenantId,
  };

  // Handle trainerProfileId separately to avoid type issues
  if (data.TreinadorId) {
    appwriteData.trainerProfileId =
      typeof data.TreinadorId === 'object'
        ? (data.TreinadorId as ITreinadorObject).Id
        : data.TreinadorId;
  }

  // Add optional fields if they exist
  if ('imageUrl' in data) {
    appwriteData.imageUrl = (data as any).imageUrl;
  }

  return appwriteData;
}

// ----------------------------------------------------------------------

export const runtime = 'edge';

export async function GET(req: NextRequest) {
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
    const searchParams = new URL(req.url).searchParams;

    const validatedParams = validatePaginationParams({
      page: Number(searchParams.get('page')) || 0,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || '',
    });

    const { page = 0, limit = 10, search = '' } = validatedParams;
    const tipoAula = searchParams.get('tipoAula');
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');

    const databases = new Databases(client);

    // Construir queries baseadas nos filtros
    const queries: string[] = [];

    if (search) {
      queries.push(Query.search('name', search));
    }

    if (tipoAula) {
      queries.push(Query.equal('type', tipoAula));
    }

    if (status) {
      queries.push(Query.equal('status', status));
    }

    if (tenantId) {
      queries.push(Query.equal('tenantId', tenantId));
    }

    // Adicionar paginação
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const appwriteResponse = await databases.listDocuments(
      'treinup',
      '6822788f002fef678707', // Classes collection
      queries
    );

    // Transform Appwrite documents to IAula
    const aulas = appwriteResponse.documents.map(transformToIAula);

    return apiResponse(
      {
        aulas,
        total: appwriteResponse.total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Aulas API]: ', error);
    return apiResponse({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(request: Request) {
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
    const data = await request.json();
    const databases = new Databases(client);

    // Validações
    if (!data.Nome) {
      return apiResponse({ message: 'Nome da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.TipoAula) {
      return apiResponse({ message: 'Tipo da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.TreinadorId) {
      return apiResponse({ message: 'Treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataInicio) {
      return apiResponse({ message: 'Data de início é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataFim) {
      return apiResponse({ message: 'Data de fim é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.Local) {
      return apiResponse({ message: 'Local é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Capacidade) {
      return apiResponse({ message: 'Capacidade é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.TenantId) {
      return apiResponse({ message: 'Tenant ID é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Validate date order
    const startDate = new Date(data.DataInicio);
    const endDate = new Date(data.DataFim);
    if (endDate <= startDate) {
      return apiResponse(
        { message: 'Data de término deve ser posterior à data de início' },
        STATUS.BAD_REQUEST
      );
    }

    // Transform IAula to Appwrite document format
    const appwriteData = transformToAppwrite(data);

    const newAula = await databases.createDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      ID.unique(),
      appwriteData
    );

    // Fetch the trainer data to include in the response
    const trainer = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      appwriteData.trainerProfileId
    );

    const responseAula = transformToIAula({
      ...newAula,
      trainerProfileId: trainer, // Replace the ID with the full trainer object
    });

    return apiResponse(
      {
        message: 'Aula criada com sucesso',
        aula: responseAula,
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Aulas - create]: ', error);
    return apiResponse({ message: 'Erro ao criar aula' }, STATUS.ERROR);
  }
}

export async function PUT(request: Request) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;
    const data = await request.json();

    if (!data.Id) {
      return apiResponse({ message: 'ID da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Validações
    if (!data.Nome) {
      return apiResponse({ message: 'Nome da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.TipoAula) {
      return apiResponse({ message: 'Tipo da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.TreinadorId) {
      return apiResponse({ message: 'Treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataInicio) {
      return apiResponse({ message: 'Data de início é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataFim) {
      return apiResponse({ message: 'Data de fim é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.Local) {
      return apiResponse({ message: 'Local é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Capacidade) {
      return apiResponse({ message: 'Capacidade é obrigatória' }, STATUS.BAD_REQUEST);
    }

    if (!data.TenantId) {
      return apiResponse({ message: 'Tenant ID é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Validate date order
    const startDate = new Date(data.DataInicio);
    const endDate = new Date(data.DataFim);
    if (endDate <= startDate) {
      return apiResponse(
        { message: 'Data de término deve ser posterior à data de início' },
        STATUS.BAD_REQUEST
      );
    }

    // Transform IAula to Appwrite document format
    const appwriteData = transformToAppwrite(data);

    const updatedAula = await databases.updateDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      data.Id,
      appwriteData
    );

    // Fetch the trainer data to include in the response
    const trainer = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      appwriteData.trainerProfileId
    );

    const responseAula = transformToIAula({
      ...updatedAula,
      trainerProfileId: trainer, // Replace the ID with the full trainer object
    });

    return apiResponse(
      {
        message: 'Aula atualizada com sucesso',
        aula: responseAula,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Aulas - update]: ', error);
    return apiResponse({ message: 'Erro ao atualizar aula' }, STATUS.ERROR);
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;
    const { id } = await request.json();

    if (!id) {
      return apiResponse({ message: 'ID da aula é obrigatório' }, STATUS.BAD_REQUEST);
    }

    await databases.deleteDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      id
    );

    return apiResponse(
      {
        message: 'Aula excluída com sucesso',
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Aulas - delete]: ', error);
    return apiResponse({ message: 'Erro ao excluir aula' }, STATUS.ERROR);
  }
}
