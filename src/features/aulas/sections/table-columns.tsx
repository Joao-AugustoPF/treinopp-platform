'use client';

import type { GridColDef } from '@mui/x-data-grid';
import { getGridSingleSelectOperators } from '@mui/x-data-grid';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import { GridActionsCellItem } from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';

import type { IAula } from '../types';

type Props = {
  handleOpenEdit: (aula: IAula) => void;
  handleOpenDelete: (aula: IAula) => void;
};

export const getAulaTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: Props): GridColDef<IAula>[] => [
  {
    field: 'Nome',
    headerName: 'Nome',
    flex: 1,
    minWidth: 260,
    filterable: true,
    sortable: true,
  },
  {
    field: 'TipoAula',
    headerName: 'Tipo',
    flex: 1,
    minWidth: 120,
    filterable: true,
    sortable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'yoga', label: 'Yoga' },
      { value: 'funcional', label: 'Funcional' },
      { value: 'outro', label: 'Outro' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
  },
  {
    field: 'DataInicio',
    headerName: 'Início',
    flex: 1,
    minWidth: 150,
    filterable: false,
    sortable: true,
    valueGetter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    },
  },
  {
    field: 'DataFim',
    headerName: 'Fim',
    flex: 1,
    minWidth: 150,
    filterable: false,
    sortable: true,
    valueGetter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    },
  },
  {
    field: 'Local',
    headerName: 'Local',
    flex: 1,
    minWidth: 150,
    filterable: true,
    sortable: true,
  },
  {
    field: 'Capacidade',
    headerName: 'Capacidade',
    flex: 1,
    minWidth: 100,
    filterable: false,
    sortable: true,
  },
  {
    field: 'Status',
    headerName: 'Status',
    flex: 1,
    minWidth: 120,
    filterable: true,
    sortable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'scheduled', label: 'Agendada' },
      { value: 'confirmed', label: 'Confirmada' },
      { value: 'in_progress', label: 'Em Andamento' },
      { value: 'completed', label: 'Concluída' },
      { value: 'cancelled', label: 'Cancelada' },
      { value: 'no_show', label: 'Ausente' },
    ],
    filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value === 'is'),
    renderCell: (params) => {
      const status = params.row.Status;
      let color = 'text.primary';
      let displayText = '';

      switch (status) {
        case 'scheduled':
          color = 'info.main';
          displayText = 'Agendada';
          break;
        case 'confirmed':
          color = 'success.main';
          displayText = 'Confirmada';
          break;
        case 'in_progress':
          color = 'warning.main';
          displayText = 'Em Andamento';
          break;
        case 'completed':
          color = 'success.main';
          displayText = 'Concluída';
          break;
        case 'cancelled':
          color = 'error.main';
          displayText = 'Cancelada';
          break;
        case 'no_show':
          color = 'error.main';
          displayText = 'Ausente';
          break;
        default:
          displayText = status;
      }

      return <span style={{ color: `var(--mui-palette-${color})` }}>{displayText}</span>;
    },
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
        key="edit"
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Editar"
        onClick={() => handleOpenEdit(params.row)}
      />,
      <GridActionsCellItem
        key="delete"
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Excluir"
        onClick={() => handleOpenDelete(params.row)}
      />,
    ],
  },
];
