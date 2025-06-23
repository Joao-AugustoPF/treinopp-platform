import type { BoxProps } from '@mui/material/Box';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

type UnidadeProfileCoverProps = {
  nome: string;
  sigla: string;
  avatarUrl?: string;
  coverUrl?: string;
} & BoxProps;

export function UnidadeProfileCover({
  sx,
  nome,
  sigla,
  coverUrl,
  avatarUrl,
  ...other
}: UnidadeProfileCoverProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: 1,
          color: 'common.white',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Avatar
          alt={nome}
          src={avatarUrl}
          sx={[
            (theme) => ({
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.vars.palette.common.white}`,
            }),
          ]}
        >
          {nome?.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          primary={nome}
          secondary={sigla}
          slotProps={{
            primary: { sx: { typography: 'h4' } },
            secondary: {
              sx: { mt: 0.5, opacity: 0.48, color: 'inherit' },
            },
          }}
          sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}
        />
      </Box>
    </Box>
  );
}
