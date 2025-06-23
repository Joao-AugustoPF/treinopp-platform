import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';

import { Image } from 'src/components/image';

type AcademiaProfileCoverProps = {
  nome: string;
  sigla: string;
  avatarUrl: string;
  coverUrl: string;
};

export function AcademiaProfileCover({
  nome,
  sigla,
  avatarUrl,
  coverUrl,
}: AcademiaProfileCoverProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        position: 'relative',
        height: { xs: 240, md: 280 },
      }}
    >
      <Image
        alt="cover"
        src={coverUrl}
        sx={{
          height: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: () => alpha(theme.palette.grey[900], 0.48),
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          width: 1,
          zIndex: 9,
          position: 'absolute',
          color: 'common.white',
          bottom: { xs: 24, md: 40 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={nome}
          sx={{
            width: { xs: 64, md: 80 },
            height: { xs: 64, md: 80 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        >
          {sigla}
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack spacing={0.5} direction="row" alignItems="center">
            <Box sx={{ typography: 'h4' }}>{nome}</Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
