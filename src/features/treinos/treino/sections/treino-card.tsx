'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  total: number;
  value: number;
  percent: number;
  icon: string;
  color: string;
};

export function TreinoCard({ title, total, value, percent, icon, color }: Props) {
  return (
    <Card
      sx={{
        width: 1,
        boxShadow: 0,
        color,
        bgcolor: 'background.default',
      }}
    >
      <Stack
        spacing={1}
        sx={{
          p: 3,
          width: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={icon} width={24} />
          <Typography variant="subtitle2">{title}</Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Box sx={{ typography: 'h4' }}>{value}</Box>

          <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {total > 0 ? `${((value / total) * 100).toFixed(0)}%` : '0%'} do total
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
