'use client';

import { AulaListView } from 'src/features/aulas/sections/view/aula-list-view';
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
      acceptRoles={['OWNER', 'TRAINER']}
      sx={{ py: 10 }}
    >
      <AulaListView />
    </RoleBasedGuard>
  );
}
