import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import type { IRole } from '../types/role';

type Props = {
  row: IRole;
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export function RoleTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }: Props) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{row.name}</TableCell>

      <TableCell>{row.policies.length}</TableCell>

      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Editar">
            <IconButton color="info" onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton color="error" onClick={onDeleteRow}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
