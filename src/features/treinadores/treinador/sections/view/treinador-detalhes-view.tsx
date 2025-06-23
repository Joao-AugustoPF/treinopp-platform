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

// ----------------------------------------------------------------------
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { ProfileCover } from '../profile-cover';
import { TreinadorProfileHome } from '../treinador-profile-home';
import { useTreinadorById } from '../../hooks/use-treinador-by-id';
import { TreinadorProfileHistory } from '../treinador-profile-history';

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

type TreinadorDetailsViewProps = {
  id: string;
};

export function TreinadorDetailsView({ id }: TreinadorDetailsViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const { treinador } = useTreinadorById(id);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (!treinador) {
    return <NotFoundView />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={treinador.Nome}
        links={[
          { name: 'Treinadores' },
          { name: 'Ficha cadastral', href: paths.treinador.list },
          { name: treinador.Nome },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={treinador.Id}
          name={treinador.Nome}
          avatarUrl={treinador.FotoPerfil ?? ''}
          coverUrl={CONFIG.assetsDir + '/assets/images/banners/treinador-banner.jpg'}
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
      {selectedTab === '' && <TreinadorProfileHome info={treinador} />}
      {selectedTab === 'history' && (
        <TreinadorProfileHistory
          createdAt={treinador.CreatedAt}
          createdBy={treinador.CreatedBy}
          updatedAt={treinador.UpdatedAt}
          updatedBy={treinador.UpdatedBy}
          historico={treinador.historico || []}
        />
      )}
    </DashboardContent>
  );
}
