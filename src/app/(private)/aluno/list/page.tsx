'use client';

import { Box, Alert, Typography } from '@mui/material';

import { AlunoListView } from 'src/features/alunos/sections/view/aluno-list-view';
import { AcademiaSelect } from 'src/features/academias/academia/sections/academia-select';
import { useAcademiaListViewStore } from 'src/features/academias/academia/stores/academia-list-view.store';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const { user } = useAuthContext();
  const { selectedAcademia } = useAcademiaListViewStore();

  const profile = user?.profile;

  const isSupport = () => profile?.role === 'SUPPORT';

  if (isSupport()) {
    return (
      <RoleBasedGuard
        hasContent
        currentRole={profile?.role || ''}
        acceptRoles={['SUPPORT']}
        sx={{ py: 10 }}
      >
        {selectedAcademia ? (
          <Box sx={{ position: 'relative' }}>
            <Alert
              severity="info"
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                mb: 2,
                border: '1px solid',
                borderColor: 'info.main',
                borderRadius: 1,
              }}
            >
              Exibindo alunos da academia: {(selectedAcademia as any).name}
            </Alert>
            <AlunoListView />
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              Selecione uma academia para visualizar os alunos
            </Typography>
            <AcademiaSelect />
          </Box>
        )}
      </RoleBasedGuard>
    );
  }

  return (
    <RoleBasedGuard
      hasContent
      currentRole={profile?.role || ''}
      acceptRoles={['OWNER', 'TRAINER']}
      sx={{ py: 10 }}
    >
      <AlunoListView />
    </RoleBasedGuard>
  );
}
