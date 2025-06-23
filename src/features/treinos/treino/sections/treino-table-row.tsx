'use client';

import { useState } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import type { ITreino } from '../types';

// ----------------------------------------------------------------------

type Props = {
  treino: ITreino;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export function TreinoTableRow({ treino, onViewRow, onEditRow, onDeleteRow }: Props) {
  const { Nome, TipoTreino, AlunoId, Exercicios } = treino;

  const router = useRouter();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell>{Nome}</TableCell>

        <TableCell>{TipoTreino}</TableCell>

        <TableCell>{AlunoId}</TableCell>

        <TableCell>{Exercicios.length}</TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>
      </Popover>
    </>
  );
}
