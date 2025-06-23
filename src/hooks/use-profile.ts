import { Query } from 'appwrite';
import { useState, useEffect, useCallback } from 'react';

import { databases } from 'src/lib/client/appwrite';

// import { getCurrentUser } from 'src/auth/actions';

export type UserRole = 'OWNER' | 'TRAINER' | 'USER' | 'SUPPORT';

export interface UserProfile {
  $id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatarUrl?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    const user = { id: '123' };
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        'treinup',
        '682161970028be4664f2', // Profiles collection ID
        [Query.equal('userId', user?.id || '')]
      );

      if (response.documents.length > 0) {
        setProfile(response.documents[0] as unknown as UserProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]) => {
      if (!profile) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(profile.role);
    },
    [profile]
  );

  const isOwner = useCallback(() => hasRole('OWNER'), [hasRole]);
  const isSupport = useCallback(() => hasRole('SUPPORT'), [hasRole]);
  const isTrainer = useCallback(() => hasRole('TRAINER'), [hasRole]);
  const isUser = useCallback(() => hasRole('USER'), [hasRole]);

  return {
    profile,
    loading,
    error,
    hasRole,
    isOwner,
    isSupport,
    isTrainer,
    isUser,
    refetch: fetchProfile,
  };
}
