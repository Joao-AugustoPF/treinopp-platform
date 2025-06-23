'use client';

import { NotificacaoListView } from 'src/features/notificacoes/sections';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function NotificacoesPage() {
  const { user } = useAuthContext();
  const profile = user?.profile;

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={['OWNER', 'TRAINER']}
      sx={{ py: 10 }}
    >
      <NotificacaoListView />
    </RoleBasedGuard>
  );
}
