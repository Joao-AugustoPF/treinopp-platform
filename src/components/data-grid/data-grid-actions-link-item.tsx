import type { Theme, SxProps } from '@mui/material';
import type { GridActionsCellItemProps } from '@mui/x-data-grid';

import { forwardRef } from 'react';

import { Link, MenuItem, ListItemIcon } from '@mui/material';

import { RouterLink } from 'src/routes/components';

type GridActionsLinkItemProps = Pick<GridActionsCellItemProps, 'icon' | 'label' | 'showInMenu'> & {
  href: string;
  sx?: SxProps<Theme>;
};

export const GridActionsLinkItem = forwardRef<HTMLLIElement, GridActionsLinkItemProps>(
  (props, ref) => {
    const { href, label, icon, sx } = props;

    return (
      <MenuItem ref={ref} sx={sx}>
        <Link
          component={RouterLink}
          href={href}
          underline="none"
          color="inherit"
          sx={{ width: 1, display: 'flex', alignItems: 'center' }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          {label}
        </Link>
      </MenuItem>
    );
  }
);
