'use client';

import type { GridColDef } from '@mui/x-data-grid';

import { IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ITreino } from '../types';

type Props = {
  handleOpenEdit: (treino: ITreino) => void;
  handleOpenDelete: (treino: ITreino) => void;
};

export const getTreinoTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: Props): GridColDef[] => [
  {
    field: 'Nome',
    headerName: 'Nome',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'TipoTreino',
    headerName: 'Tipo',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'AlunoId',
    headerName: 'Aluno',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'Exercicios',
    headerName: 'Exercícios',
    flex: 1,
    minWidth: 120,
    valueGetter: (params: any) => params.row.Exercicios?.length || 0,
    renderCell: (params) => <span>{params.row.Exercicios?.length || 0} exercícios</span>,
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <IconButton
          size="small"
          onClick={() => handleOpenEdit(params.row)}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="solar:pen-bold" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => handleOpenDelete(params.row)}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </div>
    ),
  },
];
