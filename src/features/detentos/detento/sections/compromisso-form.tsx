'use client';

import { z } from 'zod';
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

import { TipoAtendimento } from '../types/compromisso';
import { useCreateCompromisso, useUpdateCompromisso } from '../hooks';

export const CompromissoSchema = z.object({
  Id: z.string().optional(),
  Nome: z.string().min(1, 'Nome é obrigatório'),
  DetentoId: z.string().min(1, 'Detento é obrigatório'),
  DataAgendamentoCompromisso: z.string().min(1, 'Data é obrigatória'),
  HoraAgendamentoCompromisso: z.string().min(1, 'Hora é obrigatória'),
  LocalCompromisso: z.string().min(1, 'Local é obrigatório'),
  IsRealizado: z.boolean().optional(),
  HasEscolta: z.boolean().optional(),
  IsMovimentacaoExterna: z.boolean().optional(),
  Observacao: z.string().optional(),
  TipoAtendimento: z.nativeEnum(TipoAtendimento, {
    errorMap: () => ({ message: 'Tipo de atendimento é obrigatório' }),
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
  DetentoId: '',
  DataAgendamentoCompromisso: '',
  HoraAgendamentoCompromisso: '',
  LocalCompromisso: '',
  IsRealizado: false,
  HasEscolta: false,
  IsMovimentacaoExterna: false,
  Observacao: '',
  TipoAtendimento: TipoAtendimento.JURIDICO,
};

export function CompromissoForm({
  open,
  onClose,
  onSuccess,
  defaultValues,
  isEditing = false,
}: CompromissoFormProps) {
  const { createCompromisso } = useCreateCompromisso();
  const { updateCompromisso } = useUpdateCompromisso();
  const mdUp = useMediaQuery('(min-width: 600px)');

  console.log('Default Values', defaultValues);

  const methods = useForm<CompromissoFormValues>({
    resolver: zodResolver(CompromissoSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (defaultValues) methods.reset(defaultValues);
    if (!isEditing) methods.reset(initialValues);
  }, [defaultValues, methods, isEditing]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditing && defaultValues?.Id) {
        await updateCompromisso({
          ...data,
          Id: defaultValues.Id,
        });
      } else {
        await createCompromisso(data);
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar compromisso:', error);
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
        <DialogTitle>{isEditing ? 'Editar Compromisso' : 'Adicionar Compromisso'}</DialogTitle>

        <DialogContent sx={{ minHeight: 500 }}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Field.Text
              name="Nome"
              label="Nome do Compromisso"
              placeholder="Ex: Atendimento médico"
              autoFocus
            />

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              <Field.DatePicker
                name="DataAgendamentoCompromisso"
                label="Data"
                format="dd/MM/yyyy"
              />

              <Field.DatePicker name="HoraAgendamentoCompromisso" label="Hora" format="HH:mm" />
            </Box>

            <Field.Select name="TipoAtendimento" label="Tipo de Atendimento">
              {Object.values(TipoAtendimento).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="LocalCompromisso" label="Local" placeholder="Ex: Sala 101, Bloco B" />

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={2}>
              <Field.Switch name="HasEscolta" label="Necessita Escolta" />

              <Field.Switch name="IsMovimentacaoExterna" label="Movimentação Externa" />

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
