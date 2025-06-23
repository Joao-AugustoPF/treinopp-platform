// arquivo: /app/api/auth/me/route.ts

import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { Query, Client, Account, Databases } from 'node-appwrite';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
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
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. 'https://<REGION>.appwrite.io/v1'
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // seu Project ID
      .setJWT(token); // injeta o JWT

    // 3) Fetch do usuário autenticado
    const account = new Account(client);
    const user = await account.get(); // lança se o JWT não for válido

    // 4) Busca o profile na sua collection
    const databases = new Databases(client);
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!; // ex: 'treinup'
    const collectionId = '682161970028be4664f2';
    const profilesRes = await databases.listDocuments(databaseId, collectionId, [
      Query.equal('userId', user.$id),
    ]);
    const profile = profilesRes.total > 0 ? profilesRes.documents[0] : null;

    // 5) Retorna user + profile
    return NextResponse.json({ user, profile }, { status: 200 });
  } catch (error: any) {
    console.error('[Auth - me]:', error);

    const isAuthError = /general_unauthorized_scope|jwt/i.test(error.message);
    return NextResponse.json(
      {
        message: isAuthError ? 'Invalid authorization token' : 'Internal server error',
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
