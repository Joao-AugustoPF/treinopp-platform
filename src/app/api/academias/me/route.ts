import type { IAcademia } from 'src/features/academias/academia/types';

import { NextResponse, type NextRequest } from 'next/server';
import { Query, Client, Account, Databases } from 'node-appwrite';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

// Transform Appwrite data to match our interface
const transformAcademiaData = (data: any): IAcademia => ({
  Id: data.$id,
  CreatedAt: data.$createdAt,
  UpdatedAt: data.$updatedAt,
  Permissions: data.permissions,
  Name: data.name,
  Slug: data.slug,
  AddressStreet: data.addressStreet,
  AddressCity: data.addressCity,
  AddressState: data.addressState,
  AddressZip: data.addressZip,
  AddressNumber: data.addressNumber,
  Lat: data.lat,
  Lng: data.lng,
  Phone: data.phone,
  LogoUrl: data.logoUrl,
  PaymentGateway: data.paymentGateway,
  GatewayKey: data.gatewayKey,
  OwnerProfileId: data.ownerProfileId,
  TenantId: data.tenantId,
  // Email: data.email,
});

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
    const databases = new Databases(client);
    const account = new Account(client);

    // Get the current user
    const user = await account.get();
    const userId = user.$id;

    // Get the user's profile
    const userProfile = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('userId', userId),
    ]);

    if (!userProfile.documents.length) {
      return apiResponse({ message: 'User profile not found' }, STATUS.ERROR);
    }

    const profileId = userProfile.documents[0].$id;

    const searchParams = new URL(req.url).searchParams;
    const validatedParams = validatePaginationParams({
      page: Number(searchParams.get('page')) || 0,
      limit: Number(searchParams.get('limit')) || 10,
      search: searchParams.get('search') || '',
    });

    const { page = 0, limit = 10, search = '' } = validatedParams;
    const estado = searchParams.get('Estado');
    const cidade = searchParams.get('Cidade');

    // Construir queries baseadas nos filtros
    const queries: string[] = [];

    // Add query to filter by owner profile
    queries.push(Query.equal('ownerProfileId', profileId));

    if (search) {
      queries.push(Query.search('Nome', search));
    }

    if (estado) {
      queries.push(Query.equal('Estado', estado));
    }

    if (cidade) {
      queries.push(Query.equal('Cidade', cidade));
    }

    // Adicionar paginação
    queries.push(Query.limit(limit));
    queries.push(Query.offset(page * limit));

    const appwriteResponse = await databases.listDocuments('treinup', 'academies', queries);

    return apiResponse(
      {
        academias: appwriteResponse.documents.map(transformAcademiaData),
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
