'use client';

import { ID, Client, Account, Databases, Query, Functions } from 'appwrite';

import { setSession } from './utils';

// -----------------------------------------------------------
// 1) Inicializa o client Appwrite e o serviço de contas
// -----------------------------------------------------------
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://[REGION].appwrite.io/v1'
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // seu Project ID

const account = new Account(client);

// ----------------------------------------------------------------------
// Tipagem dos parâmetros
// ----------------------------------------------------------------------
export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// ----------------------------------------------------------------------
// Sign In
// ----------------------------------------------------------------------
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    // 1) Cria sessão de email+senha
    await account.createEmailPasswordSession(email, password);

    // 2) Gera um JWT curto (15 min) para usar como accessToken
    const { jwt } = await account.createJWT();

    // 3) Armazena no localStorage (ou onde você preferir) e configura axios
    setSession(jwt);
  } catch (error: any) {
    console.error('Error during Appwrite sign in:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Sign Up
// ----------------------------------------------------------------------
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  try {
    // 1) Cria o usuário no Appwrite
    const newUser = await account.create(
      ID.unique(), // gera um ID aleatório
      email,
      password,
      `${firstName} ${lastName}` // nome completo
    );

    // 2) Em seguida, já loga fazendo sessão e gerando JWT
    await account.createEmailPasswordSession(email, password);
    const { jwt } = await account.createJWT();

    // 3) Grava o token
    setSession(jwt);

    // 4) Verificar se já existe um perfil com este email (para treinadores pré-cadastrados)
    const databases = new Databases(client);
    const functions = new Functions(client);

    try {
      const profilesResponse = await databases.listDocuments(
        'treinup',
        '682161970028be4664f2', // Profiles collection
        [Query.equal('email', email)]
      );

      if (profilesResponse.documents.length > 0) {
        // Se existe um perfil, atualizar com o userId
        const existingProfile = profilesResponse.documents[0];
        const isTrainer = existingProfile.role === 'TRAINER';

        await databases.updateDocument('treinup', '682161970028be4664f2', existingProfile.$id, {
          userId: newUser.$id,
          name: `${firstName} ${lastName}`, // Atualizar o nome se necessário
          status: 'ACTIVE', // Ativar o perfil
        });

        // Se for treinador, adicionar ao team
        if (isTrainer && existingProfile.tenantId) {
          try {
            // Adicionar usuário ao team da academia
            await functions.createExecution(
              'joinDefaultTeam', // ID da função
              JSON.stringify({
                userId: newUser.$id,
                teamId: existingProfile.tenantId, // Usar o tenantId como teamId
                role: 'TRAINER', // Especificar role de treinador
              })
            );
            console.log('Treinador adicionado ao team:', existingProfile.tenantId);
          } catch (teamError) {
            console.error('Erro ao adicionar treinador ao team:', teamError);
          }
        }
      } else {
        // Se não existe perfil, criar um novo como USER
        const defaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '6821988e0022060185a9';

        await databases.createDocument('treinup', '682161970028be4664f2', ID.unique(), {
          userId: newUser.$id,
          name: `${firstName} ${lastName}`,
          email,
          role: 'USER',
          tenantId: defaultTenantId,
          // Configurações padrão
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
          status: 'ACTIVE',
        });

        console.log('Novo perfil criado para o usuário');

        // Adicionar usuário ao team padrão
        try {
          await functions.createExecution(
            'joinDefaultTeam',
            JSON.stringify({
              userId: newUser.$id,
              teamId: defaultTenantId,
              role: 'USER', // Especificar role de usuário
            })
          );
          console.log('Usuário adicionado ao team padrão:', defaultTenantId);
        } catch (teamError) {
          console.error('Erro ao adicionar usuário ao team:', teamError);
        }
      }
    } catch (profileError) {
      console.error('Erro ao processar perfil:', profileError);
      // Não falha o signup se houver erro na criação/atualização do perfil
    }
  } catch (error: any) {
    console.error('Error during Appwrite sign up:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Sign Out
// ----------------------------------------------------------------------
export const signOut = async (): Promise<void> => {
  try {
    // 1) Deleta a sessão atual no Appwrite
    await account.deleteSession('current');

    // 2) Remove o token local
    setSession(null);
  } catch (error: any) {
    console.error('Error during Appwrite sign out:', error);
    throw error;
  }
};
