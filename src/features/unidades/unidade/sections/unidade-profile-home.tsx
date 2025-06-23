'use client';

import { useCopyToClipboard } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import type { IUnidade } from '../types/unidade';

// ----------------------------------------------------------------------

type Props = {
  info: IUnidade;
};

export function UnidadeProfileHome({ info }: Props) {
  // const { copy } = useCopyToClipboard();

  const renderLocation = () => (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        sx={{ flexDirection: 'row' }}
      >
        <Stack sx={{ width: 1 }}>
          {info.Cidade}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Cidade
          </Box>
        </Stack>

        <Stack sx={{ width: 1 }}>
          {info.Estado}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Estado
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderInfo = () => (
    <Card>
      <CardHeader title="Informações" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex' }}>
          <Iconify width={24} icon="mingcute:idcard-fill" sx={{ mr: 2 }} />
          {info.SiglaUnidade}
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Iconify width={24} icon="mingcute:phone-fill" sx={{ mr: 2 }} />
          {info.Telefone}
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Iconify width={24} icon="solar:location-bold" sx={{ mr: 2 }} />
          {info.Logradouro}, {info.LogradouroNumero} - CEP {info.Cep}
        </Box>
      </Stack>
    </Card>
  );

  const renderContato = () => (
    <Card>
      <CardHeader title="Contato e Acesso" />

      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:mail-fill" sx={{ mr: 2 }} />
            {info.Email}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
            Criado em: {fDateTime(info.CreatedAt)}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
            Atualizado em: {fDateTime(info.UpdatedAt)}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {renderLocation()}
          {renderInfo()}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        {renderContato()}
      </Grid>
    </Grid>
  );
}
