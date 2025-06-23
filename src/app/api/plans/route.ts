import type { IPlan } from 'src/features/gym-plans/types/plan';

import { ID, Query } from 'appwrite';
import { Client, Databases } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response } from 'src/utils/response';
import { validatePaginationParams } from 'src/utils/pagination';

// Transform Appwrite document to IPlan
function transformToIPlan(doc: any): IPlan {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Valor: doc.price,
    Duracao: doc.durationDays,
    CreatedAt: doc.$createdAt,
    UpdatedAt: doc.$updatedAt,
  };
}

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  // 1) Extrai o header Authorization
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Authorization token missing or invalid');
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
    const tenantId = searchParams.get('tenantId');
    const duracao = searchParams.get('duracao');
    const duracaoMin = searchParams.get('duracaoMin');
    const duracaoMax = searchParams.get('duracaoMax');

    const databases = new Databases(client);

    // Build queries based on filters
    const queries: string[] = [];

    if (search) {
      queries.push(Query.search('name', search));
    }

    if (tenantId) {
      queries.push(Query.equal('tenantId', tenantId));
    }

    // Filtro por range de duração
    if (duracaoMin && duracaoMax) {
      queries.push(Query.greaterThanEqual('durationDays', parseInt(duracaoMin)));
      queries.push(Query.lessThanEqual('durationDays', parseInt(duracaoMax)));
    } else if (duracao) {
      // Fallback para filtro exato (mantém compatibilidade)
      queries.push(Query.equal('durationDays', parseInt(duracao)));
    }

    // Add pagination
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const appwriteResponse = await databases.listDocuments('treinup', 'plans', queries);

    // Transform Appwrite documents to IPlan
    const plans = appwriteResponse.documents.map(transformToIPlan);

    return response(
      {
        plans,
        total: appwriteResponse.total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Plans API]: ', error);
    return response({ message: 'Internal server error' }, STATUS.ERROR);
  }
}

export async function POST(request: Request) {
  // 1) Extrai o header Authorization
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Authorization token missing or invalid');
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

    // Validações
    if (!data.Nome) {
      return response({ message: 'Nome do plano é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Valor) {
      return response({ message: 'Valor do plano é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Duracao || data.Duracao < 30) {
      return response(
        { message: 'Duração do plano é obrigatória e deve ser maior ou igual a 30 dias' },
        STATUS.BAD_REQUEST
      );
    }

    if (!data.TenantId) {
      return response({ message: 'Tenant ID é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Transform to Appwrite document format
    const appwriteData = {
      name: data.Nome,
      price: data.Valor,
      durationDays: data.Duracao,
      tenantId: data.TenantId,
    };

    const newPlan = await databases.createDocument('treinup', 'plans', ID.unique(), appwriteData);

    return response(
      {
        message: 'Plano criado com sucesso',
        plan: transformToIPlan(newPlan),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Plans - create]: ', error);
    return response({ message: 'Erro ao criar plano' }, STATUS.ERROR);
  }
}
