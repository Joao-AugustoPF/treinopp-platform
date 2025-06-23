'use client';

import { Client, Account } from 'appwrite';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      let accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      // Check for active session in Appwrite
      const session = await account.getSession('current');

      if (session) {
        // If we have a session but no access token, create a new one
        if (!accessToken) {
          const jwt = await account.createJWT();
          accessToken = jwt.jwt;
          sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
        }

        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { user, profile } = res.data;

        setState({ user: { ...user, accessToken, profile }, loading: false });
      } else {
        // Clear session storage if no active session
        sessionStorage.removeItem(JWT_STORAGE_KEY);
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Error checking session:', error);
      sessionStorage.removeItem(JWT_STORAGE_KEY);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
