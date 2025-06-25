'use client';

import { Box } from '@mui/material';

import { TreinadorAgendaView } from 'src/features/treinadores/treinador/sections/view/treinador-agenda-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

type TreinadorAgendaPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function TreinadorAgendaPage({ params }: TreinadorAgendaPageProps) {
  const { user } = useAuthContext();

  const profile = user?.profile;

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={['OWNER', 'TRAINER', 'SUPPORT']}
      sx={{ py: 10 }}
    >
      <Box sx={{ position: 'relative' }}>
        <TreinadorAgendaView id={params.id} />
      </Box>
    </RoleBasedGuard>
  );
}
