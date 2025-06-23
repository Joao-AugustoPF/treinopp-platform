'use client';

import { TreinadorDetailsView } from 'src/features/treinadores/treinador/sections/view/treinador-detalhes-view';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

type TreinadorDetailsPageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function TreinadorDetailsPage({ params }: TreinadorDetailsPageProps) {
  const { user } = useAuthContext();
  const profile = user?.profile;

  // Allow OWNER or the treinador to view their own information
  const canView = profile?.role === 'OWNER' || profile?.id === params.id;

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={canView ? [profile?.role || ''] : []}
      sx={{ py: 10 }}
    >
      <TreinadorDetailsView id={params.id} />
    </RoleBasedGuard>
  );
}
