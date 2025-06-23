'use client';

import { AccountGeneral } from 'src/features/account/sections/view/account-general';
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
      acceptRoles={['OWNER', 'SUPPORT', 'TRAINER', 'STUDENT']}
      sx={{ py: 10 }}
    >
      <AccountGeneral />
    </RoleBasedGuard>
  );
}
