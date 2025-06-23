'use client';

// ----------------------------------------------------------------------
import { PlanListView } from 'src/features/gym-plans/sections/view/plan-list-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function PlansPage() {
  const { user } = useAuthContext();

  const profile = user?.profile;

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={['OWNER']}
      sx={{ py: 10 }}
    >
      <PlanListView />
    </RoleBasedGuard>
  );
}
