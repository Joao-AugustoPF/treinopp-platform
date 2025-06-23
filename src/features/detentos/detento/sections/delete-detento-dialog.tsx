import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { toast } from 'sonner';
import { useCallback } from 'react';

import { Button } from '@mui/material';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDeleteDetento } from '../hooks';
import { useDetentoListViewStore } from '../stores/detento-list-view.store';

type DeleteDetentoDialogProps = {
  dialog: UseBooleanReturn;
};

export const DeleteDetentoDialog = ({ dialog }: DeleteDetentoDialogProps) => {
  const { deleteDetento } = useDeleteDetento();
  const { detentoToDelete, setDetentoToDelete } = useDetentoListViewStore();

  const handleClose = useCallback(() => {
    dialog.onFalse();
    setDetentoToDelete(null);
  }, [dialog, setDetentoToDelete]);

  const handleDeleteDetento = useCallback(async () => {
    try {
      if (!detentoToDelete?.Id) return;
      toast.promise(deleteDetento(detentoToDelete.Id), {
        success: 'Detento excluído com sucesso',
        error: 'Erro ao excluirt o detento',
        loading: 'Excluíndo detento...',
      });
      await deleteDetento(detentoToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, [detentoToDelete, deleteDetento, handleClose]);

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Detento"
      content="Tem certeza que deseja excluir este detento?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteDetento}>
          Excluir
        </Button>
      }
    />
  );
};
