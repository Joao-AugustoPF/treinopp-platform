import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { IAluno } from '../types/aluno';

// ----------------------------------------------------------------------

type Props = {
  info: IAluno;
};

export function AlunoProfileHistory({ info }: any) {
  const renderSystemInfo = () => (
    <Card>
      <CardHeader title="Informações do Sistema" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <Tooltip title="Criado em" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:time-fill" sx={{ mr: 2 }} />
            {fDateTime(info.CreatedAt)}
          </Box>
        </Tooltip>

        {info.CreatedBy && (
          <Tooltip title="Criado por" placement="top" arrow>
            <Box sx={{ display: 'flex' }}>
              <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
              {info.CreatedBy}
            </Box>
          </Tooltip>
        )}

        <Tooltip title="Última atualização" placement="top" arrow>
          <Box sx={{ display: 'flex' }}>
            <Iconify width={24} icon="mingcute:time-fill" sx={{ mr: 2 }} />
            {fDateTime(info.UpdatedAt)}
          </Box>
        </Tooltip>

        {info.UpdatedBy && (
          <Tooltip title="Atualizado por" placement="top" arrow>
            <Box sx={{ display: 'flex' }}>
              <Iconify width={24} icon="mingcute:user-4-fill" sx={{ mr: 2 }} />
              {info.UpdatedBy}
            </Box>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );

  const renderPaymentHistory = () => (
    <Card>
      <CardHeader title="Histórico de Pagamentos" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {info.Pagamentos?.map((pagamento: any, index: any) => (
          <Stack key={pagamento.Id} spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                width={24}
                icon="solar:dollar-minimalistic-bold"
                sx={{
                  mr: 2,
                  color: pagamento.Status === 'Pago' ? 'success.main' : 'warning.main',
                }}
              />
              <Box>
                <Box sx={{ typography: 'subtitle2' }}>{fCurrency(pagamento.Valor)}</Box>
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  Status: {pagamento.Status}
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
                {fDateTime(pagamento.Data)}
              </Box>
            </Box>

            {index < (info.Pagamentos?.length || 0) - 1 && (
              <Divider sx={{ borderStyle: 'dashed' }} />
            )}
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        {renderSystemInfo()}
      </Grid>

      <Grid item xs={12} md={8}>
        {renderPaymentHistory()}
      </Grid>
    </Grid>
  );
}
