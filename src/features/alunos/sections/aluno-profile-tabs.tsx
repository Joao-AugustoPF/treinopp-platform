import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { useListMensalidades } from '../hooks/use-mensalidades';
import { MensalidadeControl } from './mensalidade-control';
import { AlunoProfileHome } from './aluno-profile-home';
import { AlunoProfileHistory } from './aluno-profile-history';

import type { IAluno } from '../types/aluno';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Perfil',
    icon: 'solar:user-id-bold',
  },
  {
    value: 'mensalidades',
    label: 'Mensalidades',
    icon: 'solar:dollar-minimalistic-bold',
  },
  {
    value: 'history',
    label: 'Histórico',
    icon: 'solar:clock-circle-bold',
  },
];

// ----------------------------------------------------------------------

type Props = {
  aluno: IAluno;
};

export function AlunoProfileTabs({ aluno }: Props) {
  const [currentTab, setCurrentTab] = useState('profile');

  const { mensalidades, mutate: refreshMensalidades } = useListMensalidades(aluno.Id);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'profile':
        return <AlunoProfileHome info={aluno} />;
      case 'mensalidades':
        return (
          <MensalidadeControl
            aluno={aluno}
            mensalidades={mensalidades}
            onRefresh={refreshMensalidades}
          />
        );
      case 'history':
        return <AlunoProfileHistory info={aluno} />;
      default:
        return <AlunoProfileHome info={aluno} />;
    }
  };

  return (
    <Card sx={{ minHeight: 480 }}>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          px: 3,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.vars.palette.grey['500'], 0.08)}`,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="start"
            value={tab.value}
            label={tab.label}
            icon={<Iconify icon={tab.icon} width={24} />}
          />
        ))}
      </Tabs>

      {renderTab()}
    </Card>
  );
} 