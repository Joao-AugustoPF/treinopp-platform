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
import { _detentosSocial, _detentosHistory } from 'src/_mock/_detentos';

// ----------------------------------------------------------------------
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from 'src/sections/error';

import { ProfileCover } from '../profile-cover';
import { DetentoSocial } from '../detento-social';
import { DetentoProfileHome } from '../detento-profile-home';
import { useDetentoById } from '../../hooks/use-detento-by-id';
import { DetentoProfileHistory } from '../detento-profile-history';

const NAV_ITEMS = [
  {
    value: '',
    label: 'Informações',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'social',
    label: 'Social',
    icon: <Iconify width={24} icon="solar:users-group-rounded-bold" />,
  },
  {
    value: 'history',
    label: 'Histórico',
    icon: <Iconify width={24} icon="solar:history-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

type DetentoDetailsViewProps = {
  id: string;
};

export function DetentoDetailsView({ id }: DetentoDetailsViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const { detento } = useDetentoById(id);

  console.log(detento);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (!detento) {
    return <NotFoundView />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={detento?.Nome ?? ''}
        links={[
          { name: 'Detentos' },
          { name: 'Ficha cadastral', href: paths.detento.list },
          { name: detento?.Nome },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={detento?.CID}
          name={detento?.Nome ?? ''}
          avatarUrl={detento?.FotoPerfil ?? ''}
          coverUrl={CONFIG.assetsDir + '/assets/images/banners/detento-banner.jpg'}
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
      {selectedTab === '' && <DetentoProfileHome info={detento} />}
      {selectedTab === 'social' && <DetentoSocial info={_detentosSocial[0]} />}
      {selectedTab === 'history' && (
        <DetentoProfileHistory
          createdAt={detento.CreatedAt}
          createdBy={detento.CreatedBy}
          updatedAt={detento.UpdatedAt}
          updatedBy={detento.UpdatedBy}
          historico={[
            _detentosHistory[0],
            _detentosHistory[1],
            _detentosHistory[2],
            _detentosHistory[3],
            _detentosHistory[4],
          ]}
        />
      )}
    </DashboardContent>
  );
}
