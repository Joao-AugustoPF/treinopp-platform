'use client';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { ProfileCover } from '../profile-cover';
import { AlunoProfileHome } from '../aluno-profile-home';
import { useAlunoById } from '../../hooks/use-aluno-by-id';
import { AlunoProfileHistory } from '../aluno-profile-history';

const NAV_ITEMS = [
  {
    value: '',
    label: 'Informações',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'history',
    label: 'Histórico',
    icon: <Iconify width={24} icon="solar:history-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

type AlunoDetailsViewProps = {
  id: string;
};

export function AlunoDetailsView({ id }: AlunoDetailsViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  console.log(id);

  const { aluno } = useAlunoById(id);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (!aluno) {
    return <NotFoundView />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={aluno?.Nome ?? ''}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.aluno.list },
          { name: aluno?.Nome },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={aluno?.Status}
          name={aluno?.Nome ?? ''}
          avatarUrl={typeof aluno?.Foto === 'string' ? aluno.Foto : ''}
          coverUrl={CONFIG.assetsDir + '/assets/images/banners/aluno-banner.jpg'}
        />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 1,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={selectedTab}>
            {NAV_ITEMS.map((tab) => (
              <Tab
                component={RouterLink}
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                href={createRedirectPath(pathname, tab.value)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {selectedTab === '' && <AlunoProfileHome info={aluno} />}
      {selectedTab === 'history' && <AlunoProfileHistory info={aluno} />}
    </DashboardContent>
  );
}
