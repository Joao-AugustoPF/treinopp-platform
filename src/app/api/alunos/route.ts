import type { IAluno } from 'src/features/alunos/types';

import { NextResponse, type NextRequest } from 'next/server';
import { ID, Query, Client, Account, Databases } from 'node-appwrite';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { Status } from 'src/features/alunos/types/aluno';

// Transform Appwrite document to IAluno
function transformToIAluno(
  doc: any,
  activeSubscriptions: Map<string, any>,
  plans: Map<string, any>
): IAluno {
  const activeSubscription = activeSubscriptions.get(doc.$id);
  const planDetails = activeSubscription ? plans.get(activeSubscription.planId.$id) : null;
  console.log('plans', plans);
  console.log('planDetails', planDetails);
  console.log('activeSubscription', activeSubscription);
  return {
    Id: doc.$id,
    Nome: doc.name || '',
    Email: doc.email || '',
    Telefone: doc.phoneNumber || '',
    DataNascimento: doc.birthDate || '',
    CPF: doc.cpf || '',
    Status: doc.status || Status.PENDING,
    Foto: doc.avatarUrl || null,
    Endereco: {
      Logradouro: doc.addressStreet || '',
      Bairro: doc.addressNeighborhood || '',
      Numero: doc.addressNumber || '',
      Complemento: doc.addressComplement || '',
      Cidade: doc.addressCity || '',
      Estado: doc.addressState || '',
      CEP: doc.addressZip || '',
    },
    Plano: {
      Id: activeSubscription?.planId.$id || '',
      Nome: planDetails?.name || 'Sem Plano',
      Valor: planDetails?.price || 0,
      DataInicio: activeSubscription?.startDate
        ? new Date(activeSubscription.startDate).toISOString()
        : undefined,
      DataFim: activeSubscription?.endDate
        ? new Date(activeSubscription.endDate).toISOString()
        : undefined,
    },
    TreinadorId: doc.trainerId || '',
    Treinador: doc.trainer
      ? {
          Id: doc.trainer.$id || '',
          Nome: doc.trainer.name || '',
        }
      : undefined,
    MaxBookings: doc.maxBookings || 0,
    CreatedAt: new Date(doc.$createdAt).toISOString(),
    UpdatedAt: new Date(doc.$updatedAt).toISOString(),
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
    const status = searchParams.get('status') || '';
    const plano = searchParams.get('Plano');
    const treinador = searchParams.get('Treinador');
    const cidade = searchParams.get('Cidade');
    const estado = searchParams.get('Estado');
    const tenantId = searchParams.get('tenantId');

    const databases = new Databases(client);

    // Construir queries baseadas nos filtros
    const queries: string[] = [
      // Sempre filtrar apenas usuários com role USER
      Query.equal('role', 'USER'),
    ];

    if (search) {
      queries.push(Query.search('name', search));
    }

    if (status) {
      queries.push(Query.equal('status', status));
    }

    if (treinador) {
      queries.push(Query.equal('trainerId', treinador));
    }

    if (cidade) {
      queries.push(Query.equal('addressCity', cidade));
    }

    if (estado) {
      queries.push(Query.equal('addressState', estado));
    }

    if (tenantId) {
      queries.push(Query.equal('tenantId', tenantId));
    }

    // Adicionar paginação apenas se limit for maior que 0
    if (limit > 0) {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(page * limit));
    }

    // Buscar os alunos
    const appwriteResponse = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      queries
    );

    console.log('QUERIES-ALUNOS [ API ]: ', queries);
    console.log('ALUNOS [ API ]: ', appwriteResponse.documents);

    // Buscar todas as assinaturas ativas dos alunos
    const profileIds = appwriteResponse.documents.map((doc) => doc.$id);
    const subscriptions = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', profileIds.length > 0 ? profileIds : ['none']),
      Query.equal('isActive', true),
    ]);

    // console.log('Subscriptions:', JSON.stringify(subscriptions.documents, null, 2));

    // Criar um mapa de assinaturas ativas por profileId
    const activeSubscriptions = new Map(
      subscriptions.documents.map((sub) => [sub.profileId.$id, sub])
    );

    // Buscar todos os planos referenciados nas assinaturas
    const planIds = subscriptions.documents.map((sub) => sub.planId.$id).filter(Boolean);

    // console.log('Plan IDs:', planIds);

    // Construir queries para buscar os planos
    const planQueries =
      planIds.length > 0
        ? [Query.equal('$id', planIds[0]), ...planIds.slice(1).map((id) => Query.equal('$id', id))]
        : [];

    console.log('Plan Queries:', planQueries);

    const plansResponse =
      planIds.length > 0
        ? await databases.listDocuments('treinup', 'plans', planQueries)
        : { documents: [] };

    // console.log('Plans Response:', JSON.stringify(plansResponse.documents, null, 2));

    // Criar um mapa de planos por ID
    const plans = new Map(plansResponse.documents.map((plan) => [plan.$id, plan]));

    // console.log('Plans Map:', Array.from(plans.entries()));

    // Transform Appwrite documents to IAluno
    const alunos = appwriteResponse.documents.map((doc) => {
      const activeSubscription = activeSubscriptions.get(doc.$id);
      // console.log('Active Subscription for', doc.$id, ':', activeSubscription);
      const planDetails = activeSubscription ? plans.get(activeSubscription.planId.$id) : null;
      // console.log('Plan Details for', doc.$id, ':', planDetails);
      return transformToIAluno(doc, activeSubscriptions, plans);
    });

    // Se tiver filtro por plano, filtrar os alunos que têm o plano especificado
    const alunosFiltrados = plano ? alunos.filter((aluno) => aluno.Plano.Nome === plano) : alunos;

    return apiResponse(
      {
        alunos: alunosFiltrados,
        total: alunosFiltrados.length,
        page,
        limit,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Alunos API]: ', error);
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

    console.log('tenantId user: ', tenantId);

    // Validações básicas apenas para campos obrigatórios
    if (!data.Nome) {
      return apiResponse({ message: 'Nome do aluno é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Email) {
      return apiResponse({ message: 'Email do aluno é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Telefone) {
      return apiResponse({ message: 'Telefone do aluno é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.DataNascimento) {
      return apiResponse(
        { message: 'Data de nascimento do aluno é obrigatória' },
        STATUS.BAD_REQUEST
      );
    }

    // Criar o perfil do aluno com dados seguros
    const newAluno = await databases.createDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      ID.unique(),
      {
        name: data.Nome,
        userId: null,
        email: data.Email,
        phoneNumber: data.Telefone,
        birthDate: data.DataNascimento,
        cpf: data.CPF || '',
        status: data.Status || Status.PENDING,
        avatarUrl: data.Foto || null,
        addressStreet: data.Endereco?.Logradouro || '',
        addressNeighborhood: data.Endereco?.Bairro || '',
        addressNumber: data.Endereco?.Numero || '',
        addressComplement: data.Endereco?.Complemento || '',
        addressCity: data.Endereco?.Cidade || '',
        addressState: data.Endereco?.Estado || '',
        addressZip: data.Endereco?.CEP || '',
        maxBookings: data.MaxBookings || 0,
        // trainerId: data.TreinadorId,
        role: 'USER',
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
      }
    );

    // Se tiver um plano selecionado, criar a assinatura
    if (data.Plano?.Id) {
      await databases.createDocument('treinup', 'subscriptions', ID.unique(), {
        profileId: newAluno.$id,
        planId: data.Plano.Id,
        startDate: data.Plano.DataInicio,
        endDate: data.Plano.DataFim,
        isActive: true,
        tenantId,
      });
    }

    // Buscar a assinatura e o plano para retornar os dados completos
    const subscriptions = await databases.listDocuments('treinup', 'subscriptions', [
      Query.equal('profileId', newAluno.$id),
      Query.equal('isActive', true),
      Query.limit(1),
    ]);

    const activeSubscription = subscriptions.documents[0];
    let planDetails = null;

    if (activeSubscription?.planId) {
      planDetails = await databases.getDocument('treinup', 'plans', activeSubscription.planId.$id);
    }

    const activeSubscriptions = new Map([[newAluno.$id, activeSubscription]]);
    const plans = new Map(planDetails ? [[planDetails.$id, planDetails]] : []);

    return apiResponse(
      {
        message: 'Aluno criado com sucesso',
        aluno: transformToIAluno(newAluno, activeSubscriptions, plans),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Alunos - create]: ', error);
    return apiResponse({ message: 'Erro ao criar aluno' }, STATUS.ERROR);
  }
}
