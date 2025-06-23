// src/lib/server/appwrite.js

'use server';

import { cookies } from 'next/headers';
import { Query, Client, Account, Databases } from 'node-appwrite';

import { SESSION_COOKIE } from './const';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const session = cookies().get(SESSION_COOKIE);
  if (!session || !session.value) {
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();
    const response = await databases.listDocuments(
      'treinup',
      '682161970028be4664f2', // Profiles collection ID
      [Query.equal('userId', user.$id || '')]
    );
    const profile = response.total > 0 ? response.documents[0] : null;

    // 3) Retorna um objeto unindo account + profile
    return {
      ...user,
      profile,
    };
  } catch (error) {
    console.log(error)
    return null;
  }
}
