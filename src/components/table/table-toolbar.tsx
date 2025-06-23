import type { BoxProps } from '@mui/material';

import { Box } from '@mui/material';

type Props = BoxProps;

export function TableToolbar({ children, sx, ...props }: Props) {
  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
        ...(Array.isArray(sx) ? sx : [sx]),
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
