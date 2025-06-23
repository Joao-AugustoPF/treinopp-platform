import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';
import { Button } from '@mui/material';

import { useDeleteNotificacao } from '../hooks';
import { useNotificacaoListViewStore } from '../stores/notificacao-list-view.store';
import type { UseBooleanReturn } from 'minimal-shared/hooks';

type DeleteNotificacaoDialogProps = {
  dialog: UseBooleanReturn;
};

export function DeleteNotificacaoDialog({ dialog }: DeleteNotificacaoDialogProps) {
  const { deleteNotificacao } = useDeleteNotificacao();
  const { notificacaoToDelete, setNotificacaoToDelete } = useNotificacaoListViewStore();

  const handleClose = () => {
    setNotificacaoToDelete(null);
    dialog.onFalse();
  };

  const handleDelete = async () => {
    if (!notificacaoToDelete) return;

    try {
      await toast.promise(deleteNotificacao(notificacaoToDelete.Id), {
        success: 'Notificação excluída com sucesso',
        error: 'Erro ao excluir a notificação',
        loading: 'Excluindo notificação...',
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Notificação"
      content="Tem certeza que deseja excluir esta notificação?"
      action={
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      }
    />
  );
}
