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

import { AcademiaProfileCover } from '../profile-cover';
import { AcademiaProfileHome } from '../academia-profile-home';
import { useAcademiaById } from '../../hooks/use-academia-by-id';
import { AcademiaProfileHistory } from '../academia-profile-history';

const NAV_ITEMS = [
  {
    value: '',
    label: 'Informações',
    icon: <Iconify width={24} icon="solar:buildings-2-bold" />,
  },
  // {
  //   value: 'history',
  //   label: 'Histórico',
  //   icon: <Iconify width={24} icon="solar:history-bold" />,
  // },
];

const TAB_PARAM = 'tab';

type AcademiaDetailsViewProps = {
  id: string;
};

export function AcademiaDetailsView({ id }: AcademiaDetailsViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';

  const { academia } = useAcademiaById(id);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (!academia) {
    return <NotFoundView />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={academia?.Nome ?? ''}
        links={[
          { name: 'Academias' },
          { name: 'Ficha cadastral', href: paths.academia.list },
          { name: academia?.Nome },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3, height: 290 }}>
        <AcademiaProfileCover
          nome={academia.Nome}
          sigla={academia.SiglaAcademia}
          avatarUrl=""
          coverUrl={CONFIG.assetsDir + '/assets/images/banners/building-banner.jpg'}
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

      {selectedTab === '' && <AcademiaProfileHome info={academia} />}
      {selectedTab === 'history' && (
        <AcademiaProfileHistory
          createdAt={academia.$createdAt}
          // createdBy={academia.$createdBy}
          updatedAt={academia.$updatedAt}
          // updatedBy={academia.$updatedBy}
          historico={[]}
        />
      )}
    </DashboardContent>
  );
}
