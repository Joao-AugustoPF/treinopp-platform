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

import type { ITreinador } from '../types';

// ----------------------------------------------------------------------

type Props = {
  info: ITreinador;
};

export function TreinadorProfileHome({ info }: Props) {
  const renderStats = () => (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        sx={{ flexDirection: 'row' }}
      >
        <Stack sx={{ width: 1 }}>
          {info.Especialidades?.length || 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Especialidades
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.Certificacoes?.length || 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Certificações
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = () => (
    <Card>
      <CardHeader title="Informações" />
      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <DisplayInfo value={info.CPF || ''} icon="mingcute:idcard-fill" tooltip="CPF" />
        <DisplayInfo
          value={formatPhoneNumber(info.Telefone)}
          icon="mingcute:phone-fill"
          tooltip="Telefone"
        />
        <DisplayInfo value={info.Email} icon="mingcute:email-fill" tooltip="Email" />
        <DisplayInfo
          value={fDateTime(info.DataNascimento)}
          icon="mingcute:calendar-fill"
          tooltip="Data de Nascimento"
        />
        {info.DataContratacao && (
          <DisplayInfo
            value={fDateTime(info.DataContratacao)}
            icon="mingcute:calendar-fill"
            tooltip="Data de Contratação"
          />
        )}
      </Stack>
    </Card>
  );

  const renderProfessional = () => (
    <Card>
      <CardHeader title="Informações Profissionais" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        {info.Especialidade && (
          <Grid item xs={12} md={6}>
            <DisplayInfo
              value={info.Especialidade.toString()}
              icon="mingcute:medal-fill"
              tooltip="Especialidade"
            />
          </Grid>
        )}
        {info.Nivel && (
          <Grid item xs={12} md={6}>
            <DisplayInfo value={info.Nivel.toString()} icon="mingcute:star-fill" tooltip="Nível" />
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Box sx={{ typography: 'subtitle2' }}>Especialidades</Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {info.Especialidades?.map((esp) => (
                <Box
                  key={esp}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    typography: 'caption',
                    bgcolor: 'background.neutral',
                  }}
                >
                  {esp}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Grid>
        {info.Certificacoes && info.Certificacoes.length > 0 && (
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Box sx={{ typography: 'subtitle2' }}>Certificações</Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {info.Certificacoes.map((cert) => (
                  <Box
                    key={cert}
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      typography: 'caption',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    {cert}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>
        )}
        {info.HorariosDisponiveis && (
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Box sx={{ typography: 'subtitle2' }}>Horários Disponíveis</Box>
              <Box sx={{ typography: 'body2' }}>{info.HorariosDisponiveis}</Box>
            </Stack>
          </Grid>
        )}
        {info.Biografia && (
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Box sx={{ typography: 'subtitle2' }}>Biografia</Box>
              <Box sx={{ typography: 'body2' }}>{info.Biografia}</Box>
            </Stack>
          </Grid>
        )}
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
        href={`/treinador/${info.Id}/agenda`}
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
          {renderStats()}
          {renderAbout()}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        {renderProfessional()}
      </Grid>
    </Grid>
  );
}
