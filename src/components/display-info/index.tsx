import { Box, Tooltip } from '@mui/material';

import { Iconify } from 'src/components/iconify';

type DisplayInfoProps = {
  value: string;
  icon: string;
  tooltip: string;
};

export const DisplayInfo = ({ value, icon, tooltip }: DisplayInfoProps) => (
  <Tooltip title={tooltip} placement="top" arrow>
    <Box sx={{ display: 'flex' }}>
      <Iconify width={24} icon={icon} sx={{ mr: 2 }} />
      {value}
    </Box>
  </Tooltip>
);
