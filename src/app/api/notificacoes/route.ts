import type { INotificacao } from 'src/features/notificacoes/types';

import { NextResponse, type NextRequest } from 'next/server';
import { ID, Query, Client, Account, Databases } from 'node-appwrite';

import { validatePaginationParams } from 'src/utils/pagination';
import { STATUS, response as apiResponse } from 'src/utils/response';

import { NotificacaoTipo } from 'src/features/notificacoes/types/notificacao';

// Transform Appwrite document to INotificacao
function transformToINotificacao(doc: any): INotificacao {
  return {
    Id: doc.$id,
    TenantId: doc.tenantId,
    ReadBy: doc.readBy,
    DeletedBy: doc.deletedBy,
    Titulo: doc.title,
    Mensagem: doc.message,
    Tipo: doc.type || NotificacaoTipo.INFO,
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
    const tipo = searchParams.get('tipo') || '';
    const tenantId = searchParams.get('tenantId');

    const databases = new Databases(client);
    const account = new Account(client);

    // Obter o usuário atual e seu perfil para verificar permissões
    const user = await account.get();
    const currentUserProfile = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('userId', user.$id),
      Query.limit(1),
    ]);

    let userRole = 'USER';
    let userTenantId = '';

    if (currentUserProfile.documents.length > 0) {
      const userProfile = currentUserProfile.documents[0];
      userRole = userProfile.role;
      userTenantId = userProfile.tenantId;
    }

    // Verificar se o usuário tem permissão de gerenciamento
    const isManager = userRole === 'OWNER' || userRole === 'TRAINER' || userRole === 'SUPPORT';

    // Construir queries baseadas nos filtros
    const queries: string[] = [];

    if (search) {
      queries.push(Query.search('title', search));
    }

    if (tipo) {
      queries.push(Query.equal('type', tipo));
    }

    if (tenantId) {
      queries.push(Query.equal('tenantId', tenantId));
    }

    // Adicionar paginação apenas se limit for maior que 0
    if (limit > 0) {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(page * limit));
    }

    // Ordenar por data de criação (mais recentes primeiro)
    queries.push(Query.orderDesc('$createdAt'));

    // Buscar as notificações
    const appwriteResponse = await databases.listDocuments(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      queries
    );

    console.log('QUERIES-NOTIFICACOES [ API ]: ', queries);
    console.log('NOTIFICACOES [ API ]: ', appwriteResponse.documents);

    // Transform Appwrite documents to INotificacao
    let notificacoes = appwriteResponse.documents.map((doc) => transformToINotificacao(doc));

    // Filtrar notificações baseado no tipo de usuário
    if (!isManager) {
      // Para usuários regulares, filtrar notificações soft deleted por eles
      notificacoes = notificacoes.filter((notif) => {
        return !notif.DeletedBy.includes(user.$id);
      });
    }
    // Para gerentes (OWNER, TRAINER, SUPPORT), mostrar todas as notificações

    return apiResponse(
      {
        notificacoes: notificacoes,
        total: notificacoes.length,
        page,
        limit,
        userRole, // Incluir role do usuário na resposta para debug
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Notificacoes API]: ', error);
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

    // Validações
    if (!data.Titulo) {
      return apiResponse({ message: 'Título da notificação é obrigatório' }, STATUS.BAD_REQUEST);
    }

    if (!data.Mensagem) {
      return apiResponse({ message: 'Mensagem da notificação é obrigatória' }, STATUS.BAD_REQUEST);
    }

    // Criar a notificação
    const newNotificacao = await databases.createDocument(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      ID.unique(),
      {
        title: data.Titulo,
        message: data.Mensagem,
        type: data.Tipo || NotificacaoTipo.INFO,
        tenantId,
        readBy: [],
        deletedBy: [],
      }
    );

    return apiResponse(
      {
        message: 'Notificação criada com sucesso',
        notificacao: transformToINotificacao(newNotificacao),
      },
      STATUS.CREATED
    );
  } catch (error) {
    console.error('[Notificacoes - create]: ', error);
    return apiResponse({ message: 'Erro ao criar notificação' }, STATUS.ERROR);
  }
}
