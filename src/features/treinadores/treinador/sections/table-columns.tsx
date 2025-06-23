'use client';

import { alpha } from '@mui/material/styles';
import { Chip, Stack, Avatar, Typography } from '@mui/material';
import {
  type GridColDef,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import { StatusTreinador, Especialidade } from '../types';

import type { ITreinador } from '../types';

type Props = {
  handleOpenEdit: (treinador: ITreinador) => void;
  handleOpenDelete: (treinador: ITreinador) => void;
  handleOpenView: (treinador: ITreinador) => void;
};

export const getTreinadorTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
  handleOpenView,
}: Props): GridColDef<ITreinador>[] => [
  {
    field: 'Nome',
    headerName: 'Nome',
    flex: 1,
    minWidth: 200,
    filterable: false,
    sortable: true,
    renderCell: (params) => {
      const { row } = params;

      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={row.Nome}
            src={row.Foto || row.FotoPerfil || ''}
            sx={{
              width: 40,
              height: 40,
              boxShadow: (theme) => theme.customShadows.z8,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }}
          />
          <Stack spacing={0.5}>
            <Typography variant="body2" noWrap>
              {row.Nome}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
              {row.Email}
            </Typography>
          </Stack>
        </Stack>
      );
    },
  },
  {
    field: 'Status',
    headerName: 'Status',
    width: 120,
    type: 'singleSelect',
    valueOptions: ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    sortable: true,
    filterable: true,
    renderCell: (params) => {
      const { row } = params;
      const statusLabels = {
        ACTIVE: 'Ativo',
        INACTIVE: 'Inativo',
        PENDING: 'Pendente',
        BLOCKED: 'Bloqueado',
      };
      const statusColors = {
        ACTIVE: 'success',
        INACTIVE: 'error',
        PENDING: 'warning',
        BLOCKED: 'default',
      };
      return (
        <Chip
          label={statusLabels[row.Status as unknown as keyof typeof statusLabels] || row.Status}
          color={statusColors[row.Status as unknown as keyof typeof statusColors] as any}
          size="small"
        />
      );
    },
  },
  {
    field: 'DataNascimento',
    headerName: 'Data de Nascimento',
    width: 150,
    filterable: false,
    sortable: true,
    valueFormatter: (value) => fDate(value),
  },
  {
    field: 'Telefone',
    headerName: 'Telefone',
    width: 150,
    filterable: true,
    sortable: true,
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Ações',
    align: 'right',
    headerAlign: 'right',
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    hideable: false,
    getActions: (params) => [
      <GridActionsLinkItem
        showInMenu
        icon={<Iconify icon="solar:eye-bold" />}
        label="Visualizar"
        href={paths.treinador.details(params.row.Id)}
      />,
      <GridActionsCellItem
        showInMenu
        key="edit"
        icon={<Iconify icon="solar:pen-bold" />}
        label="Editar"
        onClick={() => handleOpenEdit(params.row)}
      />,
      <GridActionsCellItem
        showInMenu
        key="delete"
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Excluir"
        onClick={() => handleOpenDelete(params.row)}
        color="error"
      />,
    ],
  },
];
