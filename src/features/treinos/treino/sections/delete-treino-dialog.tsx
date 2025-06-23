'use client';

import type { useBoolean } from 'minimal-shared/hooks';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useDeleteTreino } from '../hooks';
import { useTreinoListViewStore } from '../stores/treino-list-view.store';

type Props = {
  dialog: ReturnType<typeof useBoolean>;
};

export function DeleteTreinoDialog({ dialog }: Props) {
  const { treinoToDelete, setTreinoToDelete } = useTreinoListViewStore();
  const { deleteTreino, isLoading } = useDeleteTreino();

  const handleClose = () => {
    setTreinoToDelete(null);
    dialog.onFalse();
  };

  const handleDelete = async () => {
    try {
      if (treinoToDelete) {
        await deleteTreino(treinoToDelete.Id);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={dialog.value} onClose={handleClose}>
      <DialogTitle>Excluir Treino</DialogTitle>

      <DialogContent>
        <Typography>Tem certeza que deseja excluir o treino {treinoToDelete?.Nome}?</Typography>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="contained" color="error" onClick={handleDelete} disabled={isLoading}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
