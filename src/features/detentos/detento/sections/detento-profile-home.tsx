'use client';

import { formatPhoneNumber } from 'react-phone-number-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { DisplayInfo } from 'src/components/display-info';

import type { IDetento } from '../types';

// ----------------------------------------------------------------------

type Props = {
  info: IDetento;
};

export function DetentoProfileHome({ info }: Props) {
  const renderFollows = () => (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        sx={{ flexDirection: 'row' }}
      >
        <Stack sx={{ width: 1 }}>
          {info.Galeria}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Galeria
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.Cela}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Cela
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = () => (
    <Card>
      <CardHeader title="Informações" />
      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <DisplayInfo value={info.CID} icon="mingcute:idcard-fill" tooltip="CID" />
        <DisplayInfo
          value={formatPhoneNumber(info.Telefone)}
          icon="mingcute:phone-fill"
          tooltip="Telefone"
        />

        <DisplayInfo
          value={fDateTime(info.DataNascimento)}
          icon="mingcute:calendar-fill"
          tooltip="Data de Nascimento"
        />
      </Stack>
    </Card>
  );

  const renderSocials = () => (
    <Card>
      <CardHeader title="Aparência" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Altura} icon="game-icons:body-height" tooltip="Altura" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Sexo} icon="icons8:gender" tooltip="Sexo" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Cor} icon="ion:body" tooltip="Cor" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.CorOlhos} icon="mingcute:eye-2-line" tooltip="Cor dos Olhos" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Rosto} icon="mingcute:face-line" tooltip="Rosto" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Nariz} icon="mingcute:nose-line" tooltip="Nariz" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Boca} icon="mingcute:mouth-line" tooltip="Boca" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Dentes} icon="mdi:tooth" tooltip="Dentes" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayInfo value={info.Cabelos} icon="mingcute:hair-line" tooltip="Cabelos" />
        </Grid>
      </Grid>
    </Card>
  );

  const renderActions = () => (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="mingcute:calendar-fill" />}
        component={RouterLink}
        href={`/detento/${info.Id}/agenda`}
      >
        Ver Agenda
      </Button>
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {renderActions()}
          {renderFollows()}
          {renderAbout()}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        {renderSocials()}
      </Grid>
    </Grid>
  );
}
