'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import type { IDetentoHistorico } from '../types';

// ----------------------------------------------------------------------

type Props = {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  historico: IDetentoHistorico[];
};

export function DetentoProfileHistory({
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
  historico,
}: Props) {
  const renderCreationInfo = () => (
    <Card>
      <CardHeader title="Informações de Criação" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <Tooltip title="Criado em" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:time-fill" sx={{ mr: 2 }} />
            {fDateTime(createdAt)}
          </Box>
        </Tooltip>

        <Tooltip title="Criado por" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
            {createdBy}
          </Box>
        </Tooltip>
      </Stack>
    </Card>
  );

  const renderUpdateInfo = () => (
    <Card sx={{ mt: 3 }}>
      <CardHeader title="Informações de Atualização" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <Tooltip title="Atualizado em" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:time-fill" sx={{ mr: 2 }} />
            {fDateTime(updatedAt)}
          </Box>
        </Tooltip>

        <Tooltip title="Atualizado por" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
            {updatedBy}
          </Box>
        </Tooltip>
      </Stack>
    </Card>
  );

  const renderHistorico = () => (
    <Card>
      <CardHeader title="Histórico" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {historico.map((item, index) => (
          <Stack key={item.Id} spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                width={24}
                icon="mingcute:notification-fill"
                sx={{
                  mr: 2,
                  color:
                    item.Comportamento === 'Bom'
                      ? 'success.main'
                      : item.Comportamento === 'Regular'
                        ? 'warning.main'
                        : 'error.main',
                }}
              />
              <Box>
                <Box sx={{ typography: 'subtitle2' }}>Comportamento: {item.Comportamento}</Box>
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  Unidade ID: {item.UnidadeId}
                </Box>
              </Box>

              <Box
                sx={{
                  typography: 'caption',
                  color: 'text.secondary',
                  ml: 'auto',
                  alignSelf: 'start',
                }}
              >
                {fDateTime(item.CreatedAt)}
              </Box>
            </Box>
            <Box sx={{ typography: 'body2' }}>{item.Historico}</Box>

            {index < historico.length - 1 && <Divider sx={{ borderStyle: 'dashed' }} />}
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {renderCreationInfo()}
          {renderUpdateInfo()}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        {renderHistorico()}
      </Grid>
    </Grid>
  );
}
