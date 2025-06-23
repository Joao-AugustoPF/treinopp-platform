import { Box, Stack, Avatar, Chip, Button } from '@mui/material';
import {
  type GridColDef,
  type GridCellParams,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import type { IAluno } from '../types/aluno';

type GetAlunoTableColumnsProps = {
  handleOpenEdit: (aluno: IAluno) => void;
  handleOpenDelete: (aluno: IAluno) => void;
  handleOpenMensalidades?: (aluno: IAluno) => void;
};

const NomeCell = (params: GridCellParams<IAluno>) => (
  <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
    <Avatar
      alt={params.row.Nome}
      src={typeof params.row.Foto === 'string' ? params.row.Foto : undefined}
    />
    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
      {params.row.Nome}
      <Box component="span" sx={{ color: 'text.disabled' }}>
        {params.row.Email}
      </Box>
    </Stack>
  </Box>
);

const PlanoCell = (params: GridCellParams<IAluno>) => (
  <Stack sx={{ typography: 'body2', alignItems: 'flex-start' }}>
    {params.row.Plano.Nome}
    <Box component="span" sx={{ color: 'text.disabled' }}>
      {`R$ ${params.row.Plano.Valor.toFixed(2)}`}
    </Box>
  </Stack>
);

const StatusCell = (params: GridCellParams<IAluno>) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'PENDING':
        return 'warning';
      case 'BLOCKED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'PENDING':
        return 'Pendente';
      case 'BLOCKED':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(params.row.Status)}
      color={getStatusColor(params.row.Status)}
      size="small"
    />
  );
};

const MaxBookingsCell = (params: GridCellParams<IAluno>) => (
  <Stack sx={{ typography: 'body2', alignItems: 'flex-start' }}>
    <Box component="span" sx={{ fontWeight: 'medium' }}>
      {params.row.MaxBookings || 0}
    </Box>
    <Box component="span" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
      agendamentos
    </Box>
  </Stack>
);

export const getAlunoTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
  handleOpenMensalidades,
}: GetAlunoTableColumnsProps): GridColDef<IAluno>[] => [
  {
    field: 'Nome',
    headerName: 'Aluno',
    renderCell: NomeCell,
    flex: 1,
    filterable: false,
    sortable: true,
    minWidth: 250,
  },
  {
    field: 'Telefone',
    headerName: 'Telefone',
    flex: 1,
    filterable: true,
    sortable: true,
    minWidth: 150,
  },
  {
    field: 'Plano.Nome',
    headerName: 'Plano',
    renderCell: PlanoCell,
    flex: 1,
    type: 'singleSelect',
    valueOptions: ['Plano Básico', 'Plano Premium', 'Plano VIP'],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    sortable: true,
    minWidth: 200,
  },
  {
    field: 'Status',
    headerName: 'Status',
    renderCell: StatusCell,
    width: 120,
    type: 'singleSelect',
    valueOptions: ['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED'],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    sortable: true,
  },
  {
    field: 'MaxBookings',
    headerName: 'Agendamentos',
    renderCell: MaxBookingsCell,
    width: 150,
    filterable: false,
    sortable: true,
  },
  {
    field: 'mensalidades',
    headerName: 'Mensalidades',
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Button
        size="small"
        variant="outlined"
        startIcon={<Iconify icon="solar:dollar-minimalistic-bold" />}
        onClick={() => handleOpenMensalidades?.(params.row)}
      >
        Gerenciar
      </Button>
    ),
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
        href={paths.aluno.details(params.row.Id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Editar"
        onClick={() => handleOpenEdit(params.row)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Excluir"
        onClick={() => handleOpenDelete(params.row)}
        sx={{ color: 'error.main' }}
      />,
    ],
  },
];
