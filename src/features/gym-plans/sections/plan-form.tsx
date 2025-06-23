import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import { Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { useCreatePlan, useUpdatePlan } from '../hooks';
import { PlanSchema, type PlanSchemaType } from '../schemas/plan';

import type { IPlan } from '../types/plan';

interface PlanFormProps {
  open: boolean;
  onClose: VoidFunction;
  currentPlan?: IPlan | null;
  tenantId: string;
}

export function PlanForm({ open, onClose, currentPlan, tenantId }: PlanFormProps) {
  const { createPlan } = useCreatePlan();
  const { updatePlan } = useUpdatePlan();

  const defaultValues: PlanSchemaType = {
    Nome: '',
    Valor: 0,
    Duracao: 30,
    TenantId: tenantId,
  };

  const methods = useForm<PlanSchemaType>({
    resolver: zodResolver(PlanSchema, {
      errorMap: (error, ctx) => {
        console.log('Zod Validation Error:', {
          error,
          ctx,
          path: error.path,
          message: error.message,
        });
        return { message: error.message ?? 'Campo inválido' };
      },
    }),
    defaultValues,
    values: currentPlan ? adaptPlanToForm(currentPlan, tenantId) : undefined,
    mode: 'onSubmit',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue,
  } = methods;

  // const features = watch('features');
  const duracao = watch('Duracao');

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (currentPlan?.Id) {
          await updatePlan(currentPlan.Id, data);
        } else {
          await createPlan(data);
        }

        reset();
        onClose();
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    },
    (validationErrors) => {
      console.log('Form Validation Errors:', validationErrors);
    }
  );

  // const handleAddFeature = () => {
  //   setValue('features', [...features, '']);
  // };

  // const handleRemoveFeature = (index: number) => {
  //   setValue(
  //     'features',
  //     features.filter((_: string, i: number) => i !== index)
  //   );
  // };

  // const handleFeatureChange = (index: number, value: string) => {
  //   const newFeatures = [...features];
  //   newFeatures[index] = value;
  //   setValue('features', newFeatures);
  // };

  const handleDurationChange = (days: number) => {
    if (!isNaN(days)) {
      setValue('Duracao', days);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentPlan ? 'Editar' : 'Novo'} Plano</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Field.Text name="Nome" label="Nome" autoFocus />

            <Field.Text
              name="Valor"
              label="Preço"
              type="number"
              InputProps={{
                startAdornment: 'R$',
                inputProps: {
                  min: 0,
                  step: 0.01,
                },
              }}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setValue('Valor', value);
                }
              }}
            />

            <Field.Text
              name="Duration"
              label="Duração (dias)"
              type="number"
              value={duracao}
              onChange={(e) => handleDurationChange(parseInt(e.target.value, 10))}
              error={!!errors.Duracao}
              helperText={errors.Duracao?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentPlan ? 'Salvar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function adaptPlanToForm(plan: IPlan, tenantId: string): PlanSchemaType {
  return {
    Nome: plan.Nome,
    Valor: plan.Valor,
    Duracao: plan.Duracao,
    TenantId: tenantId,
  };
}
