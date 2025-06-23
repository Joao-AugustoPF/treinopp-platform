import { Box, Stack } from '@mui/material';
import { type GridColDef, type GridCellParams, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-grid/data-grid-actions-link-item';

import type { IUnidade } from '../../types/unidade';

type GetUnidadeTableColumnsProps = {
  handleOpenEdit: (unidade: IUnidade) => void;
  handleOpenDelete: (unidade: IUnidade) => void;
};

const NomeCell = (params: GridCellParams<IUnidade>) => (
  <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
    {/* <Avatar alt={params.row.Nome} src={params.row. ?? ''} /> */}
    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
      {params.row.Nome}
      <Box component="span" sx={{ color: 'text.disabled' }}>
        {params.row.SiglaUnidade}
      </Box>
    </Stack>
  </Box>
);

export const getUnidadeTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: GetUnidadeTableColumnsProps): GridColDef<IUnidade>[] => [
  { field: 'Nome', headerName: 'Unidade', renderCell: NomeCell, flex: 1, filterable: false },
  { field: 'Cidade', headerName: 'Cidade', flex: 1 },
  { field: 'Estado', headerName: 'Estado', flex: 1 },
  { field: 'Telefone', headerName: 'Telefone', flex: 1 },
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
        href={paths.unidade.details(params.row.Id)}
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
