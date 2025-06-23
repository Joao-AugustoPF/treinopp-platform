import type { ITreinador } from 'src/features/treinadores/treinador/types';

import { NextResponse, type NextRequest } from 'next/server';
import { ID, Query, Client, Account, Databases } from 'node-appwrite';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { createSessionClient } from 'src/lib/server/appwrite';

// Transform Appwrite document to ITreinador
function transformToITreinador(doc: any): ITreinador {
  return {
    Id: doc.$id,
    Nome: doc.name,
    Email: doc.email,
    Telefone: doc.phoneNumber,
    DataNascimento: doc.birthDate,
    Especialidades: [],
    Status: doc.status || 'ACTIVE',
    Foto: doc.avatarUrl,
    Biografia: '',
    Certificacoes: [],
    HorariosDisponiveis: '',
    CreatedAt: doc.$createdAt,
    CreatedBy: doc.$createdBy,
    UpdatedAt: doc.$updatedAt,
    UpdatedBy: doc.$updatedBy,
    IsDeleted: false,
    CPF: doc.cpf,
    Endereco: {
      Cep: doc.addressZip,
      Logradouro: doc.addressStreet,
      Numero: doc.addressNumber,
      Complemento: doc.addressComplement,
      Bairro: doc.addressNeighborhood,
      Cidade: doc.addressCity,
      Estado: doc.addressState,
    },
  };
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
    const status = searchParams.get('status');
    const tenantId = searchParams.get('tenantId');
    const databases = new Databases(client);

    // Construir queries baseadas nos filtros
    const queries: string[] = [
      // Filtrar usuários com role TRAINER ou OWNER
      Query.equal('role', ['TRAINER', 'OWNER']),
    ];

    if (search) {
      queries.push(Query.search('name', search));
    }

    if (status) {
      queries.push(Query.equal('status', status));
    }

    if (tenantId) {
      queries.push(Query.equal('tenantId', tenantId));
    }

    // Adicionar paginação apenas se limit for maior que 0
    if (limit > 0) {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(page * limit));
    }

    const appwriteResponse = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      queries
    );

    // Transform Appwrite documents to ITreinador
    const treinadores = appwriteResponse.documents.map(transformToITreinador);

    return apiResponse(
      {
        treinadores,
        total: appwriteResponse.total,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Treinadores API]: ', error);
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);
    const databases = new Databases(client);
    const account = new Account(client);
    const data = await request.json();

    const user = await account.get();

    // Get the current user's profile to get their TenantId
    const currentUser = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('userId', user.$id),
      Query.limit(1),
    ]);

    if (!currentUser.documents.length) {
      return apiResponse({ message: 'Usuário não encontrado' }, STATUS.BAD_REQUEST);
    }

    const currentUserProfile = currentUser.documents[0];
    const tenantId = currentUserProfile.tenantId;

    // Validações
    if (!data.Nome) {
      return apiResponse({ message: 'Nome do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Email) {
      return apiResponse({ message: 'Email do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Telefone) {
      return apiResponse({ message: 'Telefone do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataNascimento) {
      return apiResponse(
        { message: 'Data de nascimento do treinador é obrigatória' },
        STATUS.BAD_REQUEST
      );
    }

    if (!data.Endereco?.Logradouro) {
      return apiResponse({ message: 'Endereço do treinador é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Check if email already exists
    const existingProfile = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('email', data.Email),
    ]);

    if (existingProfile.documents.length > 0) {
      return apiResponse({ message: 'Já existe um perfil com este email' }, STATUS.CONFLICT);
    }

    // Criar o perfil do treinador
    const newTreinador = await databases.createDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      ID.unique(),
      {
        name: data.Nome,
        email: data.Email,
        phoneNumber: data.Telefone,
        birthDate: data.DataNascimento,
        cpf: data.CPF || null,
        status: data.Status || 'ACTIVE',
        avatarUrl: data.Foto || null,
        addressStreet: data.Endereco.Logradouro,
        addressNumber: data.Endereco.Numero,
        addressComplement: data.Endereco.Complemento || null,
        addressNeighborhood: data.Endereco.Bairro,
        addressCity: data.Endereco.Cidade,
        addressState: data.Endereco.Estado,
        addressZip: data.Endereco.Cep,
        role: 'TRAINER',
        userId: null,
        tenantId,
        stats_workouts: 0,
        stats_classes: 0,
        stats_achievements: 0,
        pref_notifications: true,
        pref_emailUpdates: true,
        pref_darkMode: true,
        pref_offlineMode: false,
        pref_hapticFeedback: true,
        pref_autoUpdate: true,
        pref_language: 'Português',
        privacy_publicProfile: true,
        privacy_showWorkouts: true,
        privacy_showProgress: false,
        privacy_twoFactorAuth: false,
        privacy_showClasses: true,
        privacy_showEvaluation: true,
        pref_showNotificationIcon: true,
        privacy_showNotificationIcon: true,
      }
    );

    return apiResponse(
      {
        message: 'Treinador criado com sucesso',
        treinador: transformToITreinador(newTreinador),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Treinadores - create]: ', error);
    return apiResponse({ message: 'Erro ao criar treinador' }, STATUS.ERROR);
  }
}
