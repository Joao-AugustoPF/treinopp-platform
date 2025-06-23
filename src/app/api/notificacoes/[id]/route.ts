import type { INotificacao } from 'src/features/notificacoes/types';

import { NextResponse } from 'next/server';
import { Query, Client, Databases, Account } from 'node-appwrite';

import { STATUS, response as apiResponse } from 'src/utils/response';

import { NotificacaoTipo } from 'src/features/notificacoes/types/notificacao';

// Transform Appwrite document to INotificacao
function transformToINotificacao(doc: any): INotificacao {
  return {
    Id: doc.$id,
    Titulo: doc.title,
    Mensagem: doc.message,
    TenantId: doc.tenantId,
    ReadBy: doc.readBy,
    DeletedBy: doc.deletedBy,
    Tipo: doc.type || NotificacaoTipo.INFO,
    CreatedAt: new Date(doc.$createdAt).toISOString(),
    UpdatedAt: new Date(doc.$updatedAt).toISOString(),
  };
}

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

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

    const notificacao = await databases.getDocument(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      params.id
    );

    if (!notificacao) {
      return apiResponse('Notificação não encontrada', STATUS.NOT_FOUND);
    }

    // Para usuários regulares, verificar se a notificação foi soft deleted por eles
    if (!isManager) {
      const deletedBy = notificacao.deletedBy || [];
      if (deletedBy.includes(user.$id)) {
        return apiResponse('Notificação não encontrada', STATUS.NOT_FOUND);
      }
    }

    return apiResponse({ notificacao: transformToINotificacao(notificacao) }, STATUS.OK);
  } catch (error) {
    console.error('[Notificacoes - get]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);
    const account = new Account(client);
    const notificacao = await request.json();

    console.log('Updating notificacao:', notificacao);

    // Verificar se a notificação existe
    const existingNotificacao = await databases.getDocument(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      params.id
    );

    if (!existingNotificacao) {
      return apiResponse('Notificação não encontrada', STATUS.NOT_FOUND);
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (notificacao.Titulo !== undefined) updateData.title = notificacao.Titulo;
    if (notificacao.Mensagem !== undefined) updateData.message = notificacao.Mensagem;
    if (notificacao.Tipo !== undefined) updateData.type = notificacao.Tipo;

    // Se a notificação deve ser marcada como lida, adicionar o usuário atual ao array readBy
    if (notificacao.marcarComoLida) {
      const user = await account.get();
      const currentReadBy = existingNotificacao.readBy || [];
      if (!currentReadBy.includes(user.$id)) {
        updateData.readBy = [...currentReadBy, user.$id];
      }
    }

    // Update the notification in Appwrite
    const updatedNotificacao = await databases.updateDocument(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      params.id,
      updateData
    );

    // Transform the updated notification back to INotificacao format
    const transformedNotificacao = transformToINotificacao(updatedNotificacao);

    return apiResponse({ notificacao: transformedNotificacao }, STATUS.OK);
  } catch (error) {
    console.error('[Notificacoes - update]: ', error);
    return apiResponse('Erro ao atualizar notificação', STATUS.ERROR);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token missing or invalid' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);
    const account = new Account(client);

    // Primeiro verificar se a notificação existe
    const existingNotificacao = await databases.getDocument(
      'treinup',
      '68281a17001502a83bd4', // Collection ID das Notifications
      params.id
    );

    if (!existingNotificacao) {
      return apiResponse('Notificação não encontrada', STATUS.NOT_FOUND);
    }

    // Obter o usuário atual e seu perfil
    const user = await account.get();
    const currentUserProfile = await databases.listDocuments('treinup', '682161970028be4664f2', [
      Query.equal('userId', user.$id),
      Query.limit(1),
    ]);

    if (!currentUserProfile.documents.length) {
      return apiResponse('Perfil do usuário não encontrado', STATUS.BAD_REQUEST);
    }

    const userProfile = currentUserProfile.documents[0];
    const userRole = userProfile.role;
    const userTenantId = userProfile.tenantId;

    // Verificar se o usuário tem permissão para excluir
    const canDelete = userRole === 'OWNER' || userRole === 'TRAINER' || userRole === 'SUPPORT';

    // Se o usuário tem permissão de dono/treinador/support E é do mesmo tenant
    if (canDelete && userTenantId === existingNotificacao.tenantId) {
      // Excluir realmente a notificação
      await databases.deleteDocument(
        'treinup',
        '68281a17001502a83bd4', // Collection ID das Notifications
        params.id
      );

      return apiResponse({ message: 'Notificação excluída permanentemente' }, STATUS.OK);
    } else {
      // Para usuários regulares ou sem permissão, fazer soft delete
      const currentDeletedBy = existingNotificacao.deletedBy || [];
      if (!currentDeletedBy.includes(user.$id)) {
        await databases.updateDocument(
          'treinup',
          '68281a17001502a83bd4', // Collection ID das Notifications
          params.id,
          {
            deletedBy: [...currentDeletedBy, user.$id],
          }
        );
      }

      return apiResponse({ message: 'Notificação ocultada para você' }, STATUS.OK);
    }
  } catch (error) {
    console.error('[Notificacoes - delete]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
