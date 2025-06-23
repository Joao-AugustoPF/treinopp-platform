import type { IAccount } from 'src/features/account/types';

import { Client, Databases, Storage } from 'node-appwrite';
import { NextResponse, type NextRequest } from 'next/server';

import { STATUS, response as apiResponse } from 'src/utils/response';

// Transform Appwrite document to IAccount
function transformToIAccount(doc: any): IAccount {
  return {
    Id: doc.$id,
    UserId: doc.userId,
    Name: doc.name,
    Email: doc.email,
    AvatarUrl: doc.avatarUrl,
    Role: doc.role,
    PhoneNumber: doc.phoneNumber,
    BirthDate: doc.birthDate,
    Cpf: doc.cpf,
    // Stats
    StatsWorkouts: doc.stats_workouts || 0,
    StatsClasses: doc.stats_classes || 0,
    StatsAchievements: doc.stats_achievements || 0,
    // Preferences
    PrefNotifications: doc.pref_notifications ?? true,
    PrefEmailUpdates: doc.pref_emailUpdates ?? true,
    PrefDarkMode: doc.pref_darkMode ?? false,
    PrefOfflineMode: doc.pref_offlineMode ?? false,
    PrefHapticFeedback: doc.pref_hapticFeedback ?? true,
    PrefAutoUpdate: doc.pref_autoUpdate ?? true,
    PrefLanguage: doc.pref_language || 'Português',
    // Privacy
    PrivacyPublicProfile: doc.privacy_publicProfile ?? true,
    PrivacyShowWorkouts: doc.privacy_showWorkouts ?? false,
    PrivacyShowProgress: doc.privacy_showProgress ?? true,
    PrivacyTwoFactorAuth: doc.privacy_twoFactorAuth ?? false,
    PrivacyShowClasses: doc.privacy_showClasses ?? true,
    PrivacyShowEvaluation: doc.privacy_showEvaluation ?? true,
    PrivacyShowNotificationIcon: doc.privacy_showNotificationIcon ?? true,
    // Address
    AddressStreet: doc.addressStreet,
    AddressNumber: doc.addressNumber,
    AddressComplement: doc.addressComplement,
    AddressNeighborhood: doc.addressNeighborhood,
    AddressCity: doc.addressCity,
    AddressState: doc.addressState,
    AddressZip: doc.addressZip,
    // Tenant
    TenantId: doc.tenantId,
  };
}

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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    const account = await databases.getDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    if (!account) {
      return apiResponse('Conta não encontrada', STATUS.NOT_FOUND);
    }

    return apiResponse({ account: transformToIAccount(account) }, STATUS.OK);
  } catch (error) {
    console.error('[Accounts - get]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const databases = new Databases(client);
    const storage = new Storage(client);
    const account = await req.json();

    console.log('[Accounts - update] - Dados recebidos:', account);

    // 3) Processa o AvatarUrl
    let avatarUrl = account.AvatarUrl;

    // Se o AvatarUrl é um fileId (string que não é URL), converte para URL do Appwrite
    if (
      avatarUrl &&
      typeof avatarUrl === 'string' &&
      !avatarUrl.startsWith('http') &&
      !avatarUrl.startsWith('data:')
    ) {
      try {
        // Verifica se é um fileId válido no storage
        const file = await storage.getFile('6826471c0028818bedbc', avatarUrl);
        avatarUrl = storage.getFileView('6826471c0028818bedbc', file.$id);
        console.log('[Accounts - update] - AvatarUrl convertido para URL:', avatarUrl);
      } catch (error) {
        console.warn('[Accounts - update] - Arquivo não encontrado no storage:', avatarUrl);
        avatarUrl = null;
      }
    }

    // Garante que avatarUrl seja uma string válida ou null
    if (!avatarUrl || typeof avatarUrl !== 'string') {
      avatarUrl = null;
    }

    console.log('[Accounts - update] - AvatarUrl final:', avatarUrl);

    // Update the profile in Appwrite using the ID from the request body
    const updatedProfile = await databases.updateDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      account.Id, // Usando o ID do objeto account ao invés do params
      {
        name: account.Name,
        cpf: account.Cpf,
        avatarUrl: avatarUrl,
        phoneNumber: account.PhoneNumber,
        birthDate: account.BirthDate,
        // Preferences
        pref_notifications: account.PrefNotifications,
        pref_emailUpdates: account.PrefEmailUpdates,
        pref_darkMode: account.PrefDarkMode,
        pref_offlineMode: account.PrefOfflineMode,
        pref_hapticFeedback: account.PrefHapticFeedback,
        pref_autoUpdate: account.PrefAutoUpdate,
        pref_language: account.PrefLanguage,
        // Privacy
        privacy_publicProfile: account.PrivacyPublicProfile,
        privacy_showWorkouts: account.PrivacyShowWorkouts,
        privacy_showProgress: account.PrivacyShowProgress,
        privacy_twoFactorAuth: account.PrivacyTwoFactorAuth,
        privacy_showClasses: account.PrivacyShowClasses,
        privacy_showEvaluation: account.PrivacyShowEvaluation,
        privacy_showNotificationIcon: account.PrivacyShowNotificationIcon,
        // Address
        addressStreet: account.AddressStreet,
        addressNumber: account.AddressNumber,
        addressComplement: account.AddressComplement,
        addressNeighborhood: account.AddressNeighborhood,
        addressCity: account.AddressCity,
        addressState: account.AddressState,
        addressZip: account.AddressZip,
      }
    );

    // Transform the updated profile back to IAccount format
    const transformedAccount = transformToIAccount(updatedProfile);

    return apiResponse({ account: transformedAccount }, STATUS.OK);
  } catch (error) {
    console.error('[Accounts - update]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(token);

    const databases = new Databases(client);

    // Primeiro verificar se o perfil existe
    const existingAccount = await databases.getDocument(
      'treinup',
      '682161970028be4664f2',
      params.id
    );

    if (!existingAccount) {
      return apiResponse('Conta não encontrada', STATUS.NOT_FOUND);
    }

    await databases.deleteDocument(
      'treinup',
      '682161970028be4664f2', // Profiles collection
      params.id
    );

    return apiResponse({ message: 'Conta excluída com sucesso' }, STATUS.OK);
  } catch (error) {
    console.error('[Accounts - delete]: ', error);
    return apiResponse('Internal server error', STATUS.ERROR);
  }
}
