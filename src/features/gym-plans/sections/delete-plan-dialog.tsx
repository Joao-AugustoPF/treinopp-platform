import { Button } from '@mui/material';

import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';

import { useDeletePlan } from '../hooks';
import { usePlanListViewStore } from '../stores/plan-list-view.store';

type DeletePlanDialogProps = {
  open: boolean;
  onClose: VoidFunction;
};

export function DeletePlanDialog({ open, onClose }: DeletePlanDialogProps) {
  const { deletePlan } = useDeletePlan();
  const { planToDelete, setPlanToDelete } = usePlanListViewStore();

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete.Id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setPlanToDelete(null);
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Excluir Plano"
      content="Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita."
      action={
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      }
    />
  );
}
