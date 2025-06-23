import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';

import { useDeleteAcademia } from '../hooks';
import { useAcademiaListViewStore } from '../stores/academia-list-view.store';

type DeleteAcademiaDialogProps = {
  dialog: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
  };
};

export function DeleteAcademiaDialog({ dialog }: DeleteAcademiaDialogProps) {
  const { deleteAcademia } = useDeleteAcademia();
  const { academiaToDelete, setAcademiaToDelete } = useAcademiaListViewStore();

  const handleClose = () => {
    setAcademiaToDelete(null);
    dialog.onFalse();
  };

  const handleDelete = async () => {
    if (!academiaToDelete) return;

    try {
      await deleteAcademia(academiaToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Academia"
      content="Tem certeza que deseja excluir esta academia?"
      action={
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      }
    />
  );
}
