'use client';

import { alpha } from '@mui/material/styles';
import { Chip, Stack, Avatar, Typography } from '@mui/material';
import {
  type GridColDef,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import { StatusAvaliacao } from '../types';

import type { IAvaliacao } from '../types';

type Props = {
  handleOpenEdit: (avaliacao: IAvaliacao) => void;
  handleOpenDelete: (avaliacao: IAvaliacao) => void;
  handleOpenView: (avaliacao: IAvaliacao) => void;
  handleOpenEditTime: (avaliacao: IAvaliacao) => void;
};

const getStatusLabel = (status: StatusAvaliacao) => {
  switch (status) {
    case StatusAvaliacao.AGENDADA:
      return 'Agendada';
    case StatusAvaliacao.CANCELADA:
      return 'Cancelada';
    case StatusAvaliacao.REALIZADA:
      return 'Realizada';
    default:
      return status;
  }
};

export const getAvaliacaoTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
  handleOpenView,
  handleOpenEditTime,
}: Props): GridColDef<IAvaliacao>[] => [
  {
    field: 'PerfilMembroId',
    headerName: 'Aluno',
    flex: 1,
    minWidth: 200,
    filterable: false,
    sortable: false,
    renderCell: (params) => {
      const { row } = params;
      const memberProfile: any = row.PerfilMembroId;
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={memberProfile?.Nome || 'Aluno'}
            src={memberProfile?.AvatarUrl || ''}
            sx={{
              width: 40,
              height: 40,
              boxShadow: (theme) => theme.customShadows.z8,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.24),
            }}
          />
          <Stack spacing={0.5}>
            <Typography variant="body2" noWrap>
              {memberProfile?.Nome || 'Aluno não definido'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
              {memberProfile?.Email || ''}
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
    valueOptions: [
      { value: StatusAvaliacao.AGENDADA, label: 'Agendada' },
      { value: StatusAvaliacao.CANCELADA, label: 'Cancelada' },
      { value: StatusAvaliacao.REALIZADA, label: 'Realizada' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    sortable: true,
    renderCell: (params) => {
      const { row } = params;
      return (
        <Chip
          label={getStatusLabel(row.Status)}
          color={
            row.Status === StatusAvaliacao.AGENDADA
              ? 'info'
              : row.Status === StatusAvaliacao.CANCELADA
                ? 'error'
                : row.Status === StatusAvaliacao.REALIZADA
                  ? 'success'
                  : 'default'
          }
          size="small"
        />
      );
    },
  },
  {
    field: 'DataCheckIn',
    headerName: 'Data do Check-in',
    width: 200,
    type: 'dateTime',
    sortable: true,
    valueFormatter: (value) => fDateTime(value, 'DD/MM/YYYY - HH:mm') || 'Check-in não realizado',
  },
  {
    field: 'SlotAvaliacaoId',
    headerName: 'Horário',
    width: 200,
    filterable: false,
    sortable: false,
    renderCell: (params) => {
      const { row } = params;
      const slot: any = row.SlotAvaliacaoId;
      if (!slot) return '-';

      return (
        <Stack spacing={0.5}>
          <Typography variant="body2" noWrap>
            {fDateTime(slot.DataInicio, 'DD/MM/YYYY - HH:mm')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }} noWrap>
            {slot.Local || 'Local não definido'}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'CreatedAt',
    headerName: 'Data de Criação',
    width: 180,
    type: 'dateTime',
    sortable: true,
    valueFormatter: (value) => fDateTime(value, 'DD/MM/YYYY'),
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
        key="edit"
        icon={<Iconify icon="solar:pen-bold" />}
        label="Editar"
        href={paths.treinador.avaliacao(params.row.TreinadorId || '', params.row.Id || '')}
      />,
      <GridActionsCellItem
        showInMenu
        key="edit-time"
        icon={<Iconify icon="solar:clock-circle-bold" />}
        label="Editar Horário"
        onClick={() => handleOpenEditTime(params.row)}
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
