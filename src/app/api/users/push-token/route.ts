import { NextRequest } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';
import { STATUS, response as apiResponse } from 'src/utils/response';

export async function POST(request: NextRequest) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return apiResponse(
        { message: 'Authorization token missing or invalid' },
        STATUS.UNAUTHORIZED
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);
    const { pushToken, enableNotifications = true } = await request.json();

    // Validações
    if (!pushToken) {
      return apiResponse({ message: 'Push token é obrigatório' }, STATUS.BAD_REQUEST);
    }

    // Validar formato do token Expo
    if (!pushToken.startsWith('ExponentPushToken[') || !pushToken.endsWith(']')) {
      return apiResponse({ message: 'Formato de push token inválido' }, STATUS.BAD_REQUEST);
    }

    // Buscar o perfil do usuário atual
    const userProfiles = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      [Query.equal('userId', token), Query.limit(1)]
    );

    if (!userProfiles.documents.length) {
      return apiResponse({ message: 'Perfil do usuário não encontrado' }, STATUS.NOT_FOUND);
    }

    const userProfile = userProfiles.documents[0];

    // Atualizar o perfil com o push token
    const updatedProfile = await databases.updateDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      userProfile.$id,
      {
        pushToken: pushToken,
        pref_notifications: enableNotifications,
        // Atualizar timestamp da última atualização do token
        lastPushTokenUpdate: new Date().toISOString(),
      }
    );

    return apiResponse(
      {
        message: 'Push token registrado com sucesso',
        pushTokenRegistered: true,
        notificationsEnabled: enableNotifications,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Push Token API]: ', error);
    return apiResponse({ message: 'Erro ao registrar push token' }, STATUS.ERROR);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return apiResponse(
        { message: 'Authorization token missing or invalid' },
        STATUS.UNAUTHORIZED
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    // Buscar o perfil do usuário atual
    const userProfiles = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      [Query.equal('userId', token), Query.limit(1)]
    );

    if (!userProfiles.documents.length) {
      return apiResponse({ message: 'Perfil do usuário não encontrado' }, STATUS.NOT_FOUND);
    }

    const userProfile = userProfiles.documents[0];

    // Remover o push token e desabilitar notificações
    const updatedProfile = await databases.updateDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      userProfile.$id,
      {
        pushToken: null,
        pref_notifications: false,
        lastPushTokenUpdate: new Date().toISOString(),
      }
    );

    return apiResponse(
      {
        message: 'Push token removido com sucesso',
        pushTokenRemoved: true,
        notificationsDisabled: true,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Push Token API - DELETE]: ', error);
    return apiResponse({ message: 'Erro ao remover push token' }, STATUS.ERROR);
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1) Extrai o header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return apiResponse(
        { message: 'Authorization token missing or invalid' },
        STATUS.UNAUTHORIZED
      );
    }
    const token = authHeader.split(' ')[1];

    // 2) Instancia o client Appwrite já com o JWT
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    // Buscar o perfil do usuário atual
    const userProfiles = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      [Query.equal('userId', token), Query.limit(1)]
    );

    if (!userProfiles.documents.length) {
      return apiResponse({ message: 'Perfil do usuário não encontrado' }, STATUS.NOT_FOUND);
    }

    const userProfile = userProfiles.documents[0];

    return apiResponse(
      {
        hasPushToken: !!userProfile.pushToken,
        notificationsEnabled: userProfile.pref_notifications,
        lastUpdate: userProfile.lastPushTokenUpdate,
      },
      STATUS.OK
    );
  } catch (error) {
    console.error('[Push Token API - GET]: ', error);
    return apiResponse({ message: 'Erro ao buscar status do push token' }, STATUS.ERROR);
  }
}
