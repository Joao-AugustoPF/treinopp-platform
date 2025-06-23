'use client';

import { AcademiaListView } from 'src/features/academias/academia/sections/view/academia-list-view';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const { user } = useAuthContext();
  const profile = user?.profile;

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={['SUPPORT']}
      sx={{ py: 10 }}
    >
      <AcademiaListView />
    </RoleBasedGuard>
  );
}
