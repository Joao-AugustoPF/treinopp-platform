'use client';

import { useCallback } from 'react';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { useDeleteAvaliacao } from 'src/features/treinadores/avaliacao/hooks';
import { useAvaliacaoListViewStore } from 'src/features/treinadores/avaliacao/stores/avaliacao-list-view.store';

type Props = {
  dialog: {
    value: boolean;
    onTrue: VoidFunction;
    onFalse: VoidFunction;
  };
  treinadorId: string;
};

export function DeleteAvaliacaoDialog({ dialog, treinadorId }: Props) {
  const { avaliacaoToDelete, setAvaliacaoToDelete } = useAvaliacaoListViewStore();
  const { deleteAvaliacao } = useDeleteAvaliacao(treinadorId);

  const handleClose = useCallback(() => {
    dialog.onFalse();
    setAvaliacaoToDelete(null);
  }, [dialog, setAvaliacaoToDelete]);

  const handleDelete = useCallback(async () => {
    if (!avaliacaoToDelete) return;

    try {
      await deleteAvaliacao(avaliacaoToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, [avaliacaoToDelete, deleteAvaliacao, handleClose]);

  return (
    <Dialog open={dialog.value} onClose={handleClose}>
      <DialogTitle>Excluir Avaliação</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
