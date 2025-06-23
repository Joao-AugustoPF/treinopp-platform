import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { toast } from 'sonner';
import { useCallback } from 'react';

import { Button } from '@mui/material';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDeleteTreinador } from '../hooks';
import { useTreinadorListViewStore } from '../stores/treinador-list-view.store';

type DeleteTreinadorDialogProps = {
  dialog: UseBooleanReturn;
};

export const DeleteTreinadorDialog = ({ dialog }: DeleteTreinadorDialogProps) => {
  const { deleteTreinador } = useDeleteTreinador();
  const { treinadorToDelete, setTreinadorToDelete } = useTreinadorListViewStore();

  const handleClose = useCallback(() => {
    dialog.onFalse();
    setTreinadorToDelete(null);
  }, [dialog, setTreinadorToDelete]);

  const handleDeleteTreinador = useCallback(async () => {
    try {
      if (!treinadorToDelete?.Id) return;
      toast.promise(deleteTreinador(treinadorToDelete.Id), {
        success: 'Treinador excluído com sucesso',
        error: 'Erro ao excluirt o treinador',
        loading: 'Excluíndo treinador...',
      });
      await deleteTreinador(treinadorToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, [treinadorToDelete, deleteTreinador, handleClose]);

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Treinador"
      content="Tem certeza que deseja excluir este treinador?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteTreinador}>
          Excluir
        </Button>
      }
    />
  );
};
