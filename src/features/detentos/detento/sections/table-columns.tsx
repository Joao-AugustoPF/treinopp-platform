import { Box, Stack, Avatar } from '@mui/material';
import {
  type GridColDef,
  type GridCellParams,
  GridActionsCellItem,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import { Sexo, type IDetento } from '../types';

type GetDetentoTableColumnsProps = {
  handleOpenEdit: (detento: IDetento) => void;
  handleOpenDelete: (detento: IDetento) => void;
};

const NomeCell = (params: GridCellParams<IDetento>) => (
  <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
    <Avatar alt={params.row.Nome} src={params.row.FotoPerfil ?? ''} />
    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
      {params.row.Nome}
      <Box component="span" sx={{ color: 'text.disabled' }}>
        {params.row.CID}
      </Box>
    </Stack>
  </Box>
);

export const getDetentoTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: GetDetentoTableColumnsProps): GridColDef<IDetento>[] => [
  { field: 'Nome', headerName: 'Detento', renderCell: NomeCell, flex: 1, filterable: false },
  { field: 'Galeria', headerName: 'Galeria', flex: 1, filterable: false },
  { field: 'Cela', headerName: 'Cela', flex: 1, filterable: false },
  {
    type: 'singleSelect',
    valueOptions: Object.values(Sexo),
    filterable: true,
    field: 'Sexo',
    headerName: 'Sexo',
    flex: 1,
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
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
        href={paths.detento.details(params.row.Id)}
      />,
      <GridActionsLinkItem
        showInMenu
        icon={<Iconify icon="solar:calendar-bold" />}
        label="Agenda"
        href={paths.detento.agenda(params.row.Id)}
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
