import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';

import { useDeleteAluno } from '../hooks';
import { useAlunoListViewStore } from '../stores/aluno-list-view.store';

type DeleteAlunoDialogProps = {
  dialog: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
  };
};

export function DeleteAlunoDialog({ dialog }: DeleteAlunoDialogProps) {
  const { deleteAluno } = useDeleteAluno();
  const { alunoToDelete, setAlunoToDelete } = useAlunoListViewStore();

  const handleClose = () => {
    dialog.onFalse();
    setAlunoToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!alunoToDelete) return;

      await deleteAluno(alunoToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfirmDialog
      open={dialog.value}
      onClose={handleClose}
      title="Excluir Aluno"
      content="Tem certeza que deseja excluir este aluno?"
      action={
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      }
    />
  );
}
