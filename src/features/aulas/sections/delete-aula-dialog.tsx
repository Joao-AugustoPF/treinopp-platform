'use client';

import { useState, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';

import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';

import { useDeleteAula } from '../hooks';
import { useAulaListViewStore } from '../stores/aula-list-view.store';

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export function DeleteAulaDialog({ open, onClose }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { aulaToDelete, setAulaToDelete } = useAulaListViewStore();
  const { deleteAula } = useDeleteAula();

  const handleDelete = useCallback(async () => {
    if (!aulaToDelete) return;

    try {
      setIsDeleting(true);
      await deleteAula(aulaToDelete.Id);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [aulaToDelete, deleteAula, onClose]);

  const handleClose = useCallback(() => {
    setAulaToDelete(null);
    onClose();
  }, [onClose, setAulaToDelete]);

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Excluir Aula"
      content={`Tem certeza que deseja excluir a aula "${aulaToDelete?.Nome}"?`}
      action={
        <LoadingButton
          variant="contained"
          color="error"
          onClick={handleDelete}
          loading={isDeleting}
        >
          Excluir
        </LoadingButton>
      }
    />
  );
}
