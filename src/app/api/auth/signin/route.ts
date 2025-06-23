import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from 'src/lib/server/const';
import { createAdminClient } from 'src/lib/server/appwrite';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set(SESSION_COOKIE, session.$id, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during sign in' },
      { status: 400 }
    );
  }
}
