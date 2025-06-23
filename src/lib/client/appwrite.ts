'use client';

import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
export const databases = new Databases(client);

export async function getCurrentUser() {
  try {
    // First check if we have a session
    const session = await account.getSession('current');
    if (!session) {
      return null;
    }

    // If we have a session, get the user
    const user = await account.get();
    return {
      id: user.$id,
      email: user.email,
      name: user.name,
      role: 'user', // You can set this based on your user roles
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signOut() {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}
