import { ID, Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response as apiResponse } from 'src/utils/response';

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

    const queries = [Query.equal('trainerProfileId', params.id)];

    const appwriteResponse = await databases.listDocuments(
      'treinup',
      '68227a80001b40eaaaec', // TrainerAvailability collection
      queries
    );

    return apiResponse(
      {
        disponibilidades: appwriteResponse.documents,
        total: appwriteResponse.total,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Disponibilidade API]: ', error);
    return apiResponse({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
    const treinadorId = params.id;
    const databases = new Databases(client);
    const data = await req.json();

    // Validações
    if (!data.start || !data.end) {
      return apiResponse(
        { message: 'Horário de início e fim são obrigatórios' },
        STATUS.BAD_REQUEST
      );
    }

    const appwriteData = {
      trainerProfileId: params.id,
      start: data.start,
      end: data.end,
      location: data.location,
      tenantId: data.tenantId,
    };

    const newDisponibilidade = await databases.createDocument(
      'treinup',
      '68227a80001b40eaaaec', // TrainerAvailability collection
      ID.unique(),
      appwriteData
    );

    return apiResponse(
      {
        message: 'Disponibilidade criada com sucesso',
        disponibilidade: newDisponibilidade,
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Disponibilidade - create]: ', error);
    return apiResponse({ message: 'Erro ao criar disponibilidade' }, STATUS.ERROR);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    const treinadorId = params.id;
    const databases = new Databases(client);
    const searchParams = new URL(req.url).searchParams;
    const disponibilidadeId = searchParams.get('disponibilidadeId');

    if (!disponibilidadeId) {
      return apiResponse({ message: 'ID da disponibilidade é obrigatório' }, STATUS.BAD_REQUEST);
    }

    await databases.deleteDocument(
      'treinup',
      '68227a80001b40eaaaec', // TrainerAvailability collection
      disponibilidadeId
    );

    return apiResponse(
      {
        message: 'Disponibilidade removida com sucesso',
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Disponibilidade - delete]: ', error);
    return apiResponse({ message: 'Erro ao remover disponibilidade' }, STATUS.ERROR);
  }
}
