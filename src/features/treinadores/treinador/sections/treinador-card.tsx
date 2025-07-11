'use client';

import { varAlpha } from 'minimal-shared/utils';

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

type TreinadorCardProps = {
  icon: string;
  title: string;
  total: number;
  value: number;
  percent: number;
  color: string;
};

export function TreinadorCard({ icon, title, total, value, percent, color }: TreinadorCardProps) {
  return (
    <Box
      sx={{
        width: 1,
        gap: 2.5,
        minWidth: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} width={32} sx={{ color, position: 'absolute' }} />

        <CircularProgress
          size={56}
          thickness={2}
          value={percent}
          variant="determinate"
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          size={56}
          value={100}
          thickness={3}
          variant="determinate"
          sx={[
            (theme) => ({
              top: 0,
              left: 0,
              opacity: 0.48,
              position: 'absolute',
              color: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
            }),
          ]}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{title}</Typography>

        <Box component="span" sx={{ color: 'text.disabled', typography: 'body2' }}>
          {fShortenNumber(value)} treinadores
        </Box>
      </Stack>
    </Box>
  );
}
