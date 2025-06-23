import { NextResponse, type NextRequest } from 'next/server';
import type { IAcademia } from 'src/features/academias/academia/types';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { Client, Databases, ID, Query } from 'node-appwrite';

// Transform Appwrite document to IAcademia
function transformToIAcademia(doc: any): IAcademia {
  return {
    Id: doc.$id,
    CreatedAt: doc.$createdAt,
    UpdatedAt: doc.$updatedAt,
    Permissions: doc.permissions || [],
    Name: doc.name,
    Slug: doc.slug,
    AddressStreet: doc.addressStreet,
    AddressCity: doc.addressCity,
    AddressState: doc.addressState,
    AddressZip: doc.addressZip,
    AddressNumber: doc.addressNumber || '',
    Lat: doc.lat,
    Lng: doc.lng,
    Phone: doc.phone,
    LogoUrl: doc.logoUrl,
    PaymentGateway: doc.paymentGateway,
    GatewayKey: doc.gatewayKey,
    OwnerProfileId: doc.ownerProfileId,
    TenantId: doc.tenantId,
  };
}

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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);
    const searchParams = new URL(req.url).searchParams;

    const validatedParams = validatePaginationParams({
      page: Number(searchParams.get('page')) || 0,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || '',
    });

    const { page = 0, limit = 10, search = '' } = validatedParams;
    const estado = searchParams.get('estado');
    const cidade = searchParams.get('cidade');

    const databases = new Databases(client);

    // Construir queries baseadas nos filtros
    const queries: string[] = [];

    if (search) {
      queries.push(Query.search('name', search));
    }

    if (estado) {
      queries.push(Query.equal('addressState', estado));
    }

    if (cidade) {
      queries.push(Query.equal('addressCity', cidade));
    }

    // Adicionar paginação
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const appwriteResponse = await databases.listDocuments('treinup', 'academies', queries);

    // Transform Appwrite documents to IAcademia
    const academias = appwriteResponse.documents.map(transformToIAcademia);

    return apiResponse(
      {
        academias,
        total: appwriteResponse.total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Academias API]: ', error);
    return apiResponse({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(request: NextRequest) {
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

    if (!data.Nome) {
      return apiResponse({ message: 'Nome é obrigatório' }, 400);
    }

    if (!data.Email) {
      return apiResponse({ message: 'Email é obrigatório' }, 400);
    }

    if (!data.Telefone) {
      return apiResponse({ message: 'Telefone é obrigatório' }, 400);
    }

    if (!data.Logradouro) {
      return apiResponse({ message: 'Logradouro é obrigatório' }, 400);
    }

    if (!data.LogradouroNumero) {
      return apiResponse({ message: 'Número é obrigatório' }, 400);
    }

    if (!data.Cep) {
      return apiResponse({ message: 'CEP é obrigatório' }, 400);
    }

    if (!data.Cidade) {
      return apiResponse({ message: 'Cidade é obrigatória' }, 400);
    }

    if (!data.Estado) {
      return apiResponse({ message: 'Estado é obrigatório' }, 400);
    }

    const newAcademia = await databases.createDocument('treinup', 'academies', ID.unique(), {
      ...data,
      CreatedAt: new Date().toISOString(),
      CreatedBy: 'system',
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: 'system',
      IsDeleted: false,
    });

    return apiResponse(
      {
        message: 'Academia criada com sucesso',
        academia: transformToIAcademia(newAcademia),
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('Erro ao criar academia:', error);
    return apiResponse({ message: 'Erro ao criar academia' }, 500);
  }
}
