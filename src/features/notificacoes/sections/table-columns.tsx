import { type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Box, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { INotificacao, NotificacaoTipo } from '../types/notificacao';

type GetNotificacaoTableColumnsProps = {
  handleOpenEdit: (notificacao: INotificacao) => void;
  handleOpenDelete: (notificacao: INotificacao) => void;
};

const getTipoColor = (tipo: NotificacaoTipo) => {
  switch (tipo) {
    case NotificacaoTipo.INFO:
      return 'info';
    case NotificacaoTipo.SUCCESS:
      return 'success';
    case NotificacaoTipo.WARNING:
      return 'warning';
    case NotificacaoTipo.ERROR:
      return 'error';
    default:
      return 'default';
  }
};

const getTipoLabel = (tipo: NotificacaoTipo) => {
  switch (tipo) {
    case NotificacaoTipo.INFO:
      return 'Informação';
    case NotificacaoTipo.SUCCESS:
      return 'Sucesso';
    case NotificacaoTipo.WARNING:
      return 'Aviso';
    case NotificacaoTipo.ERROR:
      return 'Erro';
    default:
      return tipo;
  }
};

const isNotificationRead = (readBy: string[], currentUserId?: string) => {
  if (!currentUserId) return false;
  return readBy.includes(currentUserId);
};

export const getNotificacaoTableColumns = ({
  handleOpenEdit,
  handleOpenDelete,
}: GetNotificacaoTableColumnsProps): GridColDef<INotificacao>[] => [
  {
    field: 'Titulo',
    headerName: 'Título',
    flex: 1,
    minWidth: 300,
    renderCell: (params) => {
      const isRead = params.row.ReadBy?.length > 0; // Consider read if anyone has read it

      return (
        <Box sx={{ width: '100%', py: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: !isRead ? 600 : 400,
              color: !isRead ? 'text.primary' : 'text.primary',
              mb: 0.5,
              lineHeight: 1.2,
            }}
          >
            {params.value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {params.row.Mensagem}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'Tipo',
    headerName: 'Tipo',
    width: 120,
    renderCell: (params) => (
      <Label variant="soft" color={getTipoColor(params.value)}>
        {getTipoLabel(params.value)}
      </Label>
    ),
  },
  {
    field: 'ReadBy',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => {
      const isRead = params.value?.length > 0;

      return (
        <Label variant="soft" color={isRead ? 'success' : 'warning'}>
          {isRead ? 'Lida' : 'Não Lida'}
        </Label>
      );
    },
  },
  {
    field: 'ReadBy',
    headerName: 'Lida por',
    width: 100,
    renderCell: (params) => (
      <Typography variant="caption" color="text.secondary">
        {params.value?.length || 0} usuário(s)
      </Typography>
    ),
  },
  {
    field: 'CreatedAt',
    headerName: 'Criada',
    width: 150,
    renderCell: (params) =>
      formatDistanceToNow(new Date(params.value), {
        addSuffix: true,
        locale: ptBR,
      }),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Ações',
    width: 100,
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
      />,
    ],
  },
];
