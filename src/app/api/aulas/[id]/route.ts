import type { IAula } from 'src/features/aulas/types';

import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

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

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const aula = await databases.getDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      params.id
    );

    // Fetch the trainer data to include in the response
    const trainer = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      aula.trainerProfileId.$id
    );

    const responseAula = transformToIAula({
      ...aula,
      trainerProfileId: trainer, // Replace the ID with the full trainer object
    });

    return apiResponse({ aula: responseAula }, STATUS.OK);
  } catch (error) {
    console.error('[Aula - get]: ', error);
    return apiResponse({ message: 'Erro ao buscar aula' }, STATUS.ERROR);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the current aula to preserve tenantId
    const currentAula = await databases.getDocument('treinup', '6822788f002fef678707', params.id);

    // Transform IAula to Appwrite document format
    const appwriteData = {
      name: data.Nome,
      type: data.TipoAula,
      trainerProfileId:
        typeof data.TreinadorId === 'object' ? data.TreinadorId.Id : data.TreinadorId,
      start: data.DataInicio,
      end: data.DataFim,
      location: data.Local,
      capacity: data.Capacidade,
      status: data.Status,
      tenantId: currentAula.tenantId, // Preserve the tenantId
    };

    const updatedAula = await databases.updateDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      params.id,
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
    console.error('[Aula - update]: ', error);
    return apiResponse({ message: 'Erro ao atualizar aula' }, STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await createSessionClient();
    const databases = client.databases;

    await databases.deleteDocument(
      'treinup',
      '6822788f002fef678707', // Classes collection
      params.id
    );

    return apiResponse({ message: 'Aula excluída com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Aula - delete]: ', error);
    return apiResponse({ message: 'Erro ao excluir aula' }, STATUS.ERROR);
  }
}
