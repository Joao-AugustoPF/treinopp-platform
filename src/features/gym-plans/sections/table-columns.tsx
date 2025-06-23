import {
  type GridColDef,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';

import type { IPlan } from '../types/plan';

type GetPlanTableColumnsProps = {
  handleOpenEdit: (plan: IPlan) => void;
  handleOpenDelete: (plan: IPlan) => void;
};

export const getPlanTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: GetPlanTableColumnsProps): GridColDef<IPlan>[] => [
  {
    field: 'Nome',
    headerName: 'Nome',
    flex: 1,
    filterable: true,
    sortable: true,
    minWidth: 200,
  },
  {
    field: 'Valor',
    headerName: 'Valor',
    flex: 1,
    filterable: false,
    sortable: true,
    minWidth: 150,
    valueFormatter: (value) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value),
  },
  {
    field: 'Duracao',
    headerName: 'Duração',
    flex: 1,
    filterable: true,
    sortable: true,
    minWidth: 150,
    type: 'singleSelect',
    valueOptions: [
      { value: '30', label: 'Até 30 dias' },
      { value: '60', label: '31-60 dias' },
      { value: '90', label: '61-90 dias' },
      { value: '180', label: '91-180 dias' },
      { value: '365', label: '181-365 dias' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    valueFormatter: (value) => `${value} dias`,
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
