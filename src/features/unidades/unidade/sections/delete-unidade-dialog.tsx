import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { toast } from 'sonner';
import { useCallback } from 'react';

import { Button } from '@mui/material';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { useDeleteUnidade } from '../hooks';
import { useUnidadeListViewStore } from '../stores/unidade-list-view.store';

type DeleteUnidadeDialogProps = {
  dialog: UseBooleanReturn;
};

export const DeleteUnidadeDialog = ({ dialog }: DeleteUnidadeDialogProps) => {
  const { deleteUnidade } = useDeleteUnidade();
  const { unidadeToDelete, setUnidadeToDelete } = useUnidadeListViewStore();

  const handleClose = useCallback(() => {
    dialog.onFalse();
    setUnidadeToDelete(null);
  }, [dialog, setUnidadeToDelete]);

  const handleDeleteUnidade = useCallback(async () => {
    try {
      if (!unidadeToDelete?.Id) return;
      toast.promise(deleteUnidade(unidadeToDelete.Id), {
        success: 'Unidade excluída com sucesso',
        error: 'Erro ao excluir a unidade',
        loading: 'Excluindo unidade...',
      });
      await deleteUnidade(unidadeToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, [unidadeToDelete, deleteUnidade, handleClose]);

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Unidade"
      content="Tem certeza que deseja excluir esta unidade?"
      action={
        <Button variant="contained" color="error" onClick={handleDeleteUnidade}>
          Excluir
        </Button>
      }
    />
  );
};
