import {
  type GridColDef,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import type { IAcademia } from '../../types/academia';

type GetAcademiaTableColumnsProps = {
  handleOpenEdit: (academia: IAcademia) => void;
  handleOpenDelete: (academia: IAcademia) => void;
};

export const getAcademiaTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: GetAcademiaTableColumnsProps): GridColDef<IAcademia>[] => [
  {
    field: 'Name',
    headerName: 'Nome',
    flex: 1,
    minWidth: 200,
    filterable: true,
    sortable: true,
  },
  {
    field: 'AddressCity',
    headerName: 'Cidade',
    flex: 1,
    minWidth: 150,
    filterable: true,
    sortable: true,
  },
  {
    field: 'AddressState',
    headerName: 'Estado',
    flex: 1,
    minWidth: 100,
    filterable: true,
    sortable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'SP', label: 'São Paulo' },
      { value: 'RJ', label: 'Rio de Janeiro' },
      { value: 'MG', label: 'Minas Gerais' },
      { value: 'BA', label: 'Bahia' },
      { value: 'PR', label: 'Paraná' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
  },
  {
    field: 'Phone',
    headerName: 'Telefone',
    flex: 1,
    minWidth: 150,
    filterable: false,
    sortable: true,
  },
  {
    field: 'PaymentGateway',
    headerName: 'Gateway de Pagamento',
    flex: 1,
    minWidth: 180,
    filterable: true,
    sortable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'stripe', label: 'Stripe' },
      { value: 'mercadoPago', label: 'Mercado Pago' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Ações',
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    hideable: false,
    getActions: (params) => [
      <GridActionsLinkItem
        key="details"
        icon={<Iconify icon="solar:eye-bold" />}
        label="Detalhes"
        href={paths.academia.details(params.row.Id)}
      />,
      <GridActionsCellItem
        key="edit"
        icon={<Iconify icon="solar:pen-bold" />}
        label="Editar"
        onClick={() => handleOpenEdit(params.row)}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Excluir"
        onClick={() => handleOpenDelete(params.row)}
        sx={{ color: 'error.main' }}
      />,
    ],
  },
];
