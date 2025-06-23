'use client';

import { z } from 'zod';
import dayjs from 'dayjs';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Dialog,
  Button,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { TipoTreinamento } from '../types/treinador';
import { useCreateTreinamento, useUpdateTreinamento } from '../hooks';

export const CompromissoSchema = z.object({
  Id: z.string().optional(),
  Nome: z.string().min(1, 'Nome é obrigatório'),
  TreinadorId: z.string().min(1, 'Treinador é obrigatório'),
  AlunoId: z.string().min(1, 'Aluno é obrigatório'),
  DataAgendamentoTreinamento: z.string().min(1, 'Data é obrigatória'),
  HoraAgendamentoTreinamento: z.string().min(1, 'Hora é obrigatória'),
  LocalTreinamento: z.string().min(1, 'Local é obrigatório'),
  IsRealizado: z.boolean().optional(),
  HasEquipamento: z.boolean().optional(),
  IsTreinamentoExterno: z.boolean().optional(),
  Observacao: z.string().optional(),
  TipoTreinamento: z.nativeEnum(TipoTreinamento, {
    errorMap: () => ({ message: 'Tipo de treinamento é obrigatório' }),
  }),
});

export type CompromissoFormValues = z.infer<typeof CompromissoSchema>;

type CompromissoFormProps = {
  open: boolean;
  onClose: VoidFunction;
  onSuccess?: VoidFunction;
  defaultValues?: Partial<CompromissoFormValues>;
  isEditing?: boolean;
};

const initialValues: CompromissoFormValues = {
  Id: '',
  Nome: '',
  TreinadorId: '',
  AlunoId: '',
  DataAgendamentoTreinamento: '',
  HoraAgendamentoTreinamento: '',
  LocalTreinamento: '',
  IsRealizado: false,
  HasEquipamento: false,
  IsTreinamentoExterno: false,
  Observacao: '',
  TipoTreinamento: TipoTreinamento.FORCA,
};

export function CompromissoForm({
  open,
  onClose,
  onSuccess,
  defaultValues,
  isEditing = false,
}: CompromissoFormProps) {
  const { createTreinamento } = useCreateTreinamento();
  const { updateTreinamento } = useUpdateTreinamento();
  const mdUp = useMediaQuery('(min-width: 600px)');

  const methods = useForm<CompromissoFormValues>({
    resolver: zodResolver(CompromissoSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (defaultValues) {
      // Convert the stored date and time to local format for display
      const formattedDefaults = {
        ...defaultValues,
        DataAgendamentoTreinamento: defaultValues.DataAgendamentoTreinamento
          ? dayjs(defaultValues.DataAgendamentoTreinamento).format('YYYY-MM-DD')
          : '',
        HoraAgendamentoTreinamento: defaultValues.HoraAgendamentoTreinamento
          ? dayjs(defaultValues.HoraAgendamentoTreinamento, 'HH:mm').format('HH:mm')
          : '',
      };
      methods.reset(formattedDefaults);
    }
    if (!isEditing) methods.reset(initialValues);
  }, [defaultValues, methods, isEditing]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Ensure we're using the exact time selected by the user
      const formattedData = {
        ...data,
        DataAgendamentoTreinamento: dayjs(data.DataAgendamentoTreinamento).format('YYYY-MM-DD'),
        HoraAgendamentoTreinamento: dayjs(data.HoraAgendamentoTreinamento, 'HH:mm').format('HH:mm'),
      };

      if (isEditing && defaultValues?.Id) {
        await updateTreinamento({
          ...formattedData,
          Id: defaultValues.Id,
        });
      } else {
        await createTreinamento({
          ...formattedData,
          IsRealizado: data.IsRealizado ?? false,
          HasEquipamento: data.HasEquipamento ?? false,
          IsTreinamentoExterno: data.IsTreinamentoExterno ?? false,
        });
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
    }
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  const renderDialogActions = (
    <DialogActions>
      <Button variant="outlined" color="inherit" onClick={handleCancel}>
        Cancelar
      </Button>

      <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
        {isEditing ? 'Salvar' : 'Criar'}
      </LoadingButton>
    </DialogActions>
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} fullScreen={!mdUp}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEditing ? 'Editar Treinamento' : 'Adicionar Treinamento'}</DialogTitle>

        <DialogContent sx={{ minHeight: 500 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Field.Text
              name="Nome"
              label="Nome do Treinamento"
              placeholder="Ex: Treino de força"
              autoFocus
            />

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              <Field.DatePicker
                name="DataAgendamentoTreinamento"
                label="Data"
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false,
                  },
                }}
              />

              <Field.DatePicker
                name="HoraAgendamentoTreinamento"
                label="Hora"
                format="HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false,
                  },
                }}
              />
            </Box>

            <Field.Select name="TipoTreinamento" label="Tipo de Treinamento">
              {Object.values(TipoTreinamento).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text
              name="LocalTreinamento"
              label="Local"
              placeholder="Ex: Academia, Sala 101"
            />

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={2}>
              <Field.Switch name="HasEquipamento" label="Necessita Equipamento" />

              <Field.Switch name="IsTreinamentoExterno" label="Treinamento Externo" />

              <Field.Switch name="IsRealizado" label="Realizado" />
            </Box>

            <Field.Text name="Observacao" label="Observações" multiline rows={3} />
          </Stack>
        </DialogContent>

        {renderDialogActions}
      </Form>
    </Dialog>
  );
}
