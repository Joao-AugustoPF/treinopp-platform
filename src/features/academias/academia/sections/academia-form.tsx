import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Form, Field } from 'src/components/hook-form';

import { useCreateAcademia, useUpdateAcademia } from '../hooks';
import { useAcademiaListViewStore } from '../stores/academia-list-view.store';

const schema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  NomeExibicao: z.string().min(1, 'Nome de exibição é obrigatório'),
  SiglaAcademia: z.string().min(1, 'Sigla é obrigatória'),
  Telefone: z.string().min(8, 'Telefone é obrigatório'),
  Email: z.string().email('Email inválido'),
  OwnerEmail: z.string().email('Email do proprietário inválido'),
  Logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  LogradouroNumero: z.string().min(1, 'Número é obrigatório'),
  Complemento: z.string().optional(),
  Bairro: z.string().min(1, 'Bairro é obrigatório'),
  Cidade: z.string().min(1, 'Cidade é obrigatória'),
  Estado: z.string().min(2, 'Estado é obrigatório'),
  Cep: z.string().min(8, 'CEP é obrigatório'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  dialog: UseBooleanReturn;
};

const defaultValues: FormValues = {
  Nome: '',
  NomeExibicao: '',
  SiglaAcademia: '',
  Email: '',
  OwnerEmail: '',
  Telefone: '',
  Logradouro: '',
  LogradouroNumero: '',
  Complemento: '',
  Bairro: '',
  Cidade: '',
  Estado: '',
  Cep: '',
};

export function AcademiaForm({ dialog }: Props) {
  const { currentAcademia, setCurrentAcademia } = useAcademiaListViewStore();

  const { createAcademia } = useCreateAcademia();
  const { updateAcademia } = useUpdateAcademia();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (currentAcademia) {
        await updateAcademia(currentAcademia.Id, data);
      } else {
        await createAcademia(data);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    dialog.onFalse();
    reset(defaultValues);
    setCurrentAcademia(null);
  };

  useEffect(() => {
    if (!currentAcademia) return;
    reset({
      Nome: currentAcademia.Name,
      NomeExibicao: currentAcademia.Name,
      SiglaAcademia: currentAcademia.Slug,
      Telefone: currentAcademia.Phone || '',
      Email: '',
      OwnerEmail: '',
      Logradouro: currentAcademia.AddressStreet,
      LogradouroNumero: currentAcademia.AddressNumber,
      Complemento: '',
      Bairro: '',
      Cidade: currentAcademia.AddressCity,
      Estado: currentAcademia.AddressState,
      Cep: currentAcademia.AddressZip,
    });
  }, [currentAcademia, reset]);

  return (
    <Dialog open={dialog.value} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{currentAcademia ? 'Editar Academia' : 'Nova Academia'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="Nome" label="Nome da Academia" />
                <Field.Text name="NomeExibicao" label="Nome de Exibição" />
                <Field.Text name="SiglaAcademia" label="Sigla" />
                <Field.Text name="Telefone" label="Telefone" />
                <Field.Text name="Email" label="Email" />
                <Field.Text name="OwnerEmail" label="Email do Proprietário" />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="Logradouro" label="Logradouro" />
                <Field.Text name="LogradouroNumero" label="Número" />
                <Field.Text name="Complemento" label="Complemento" />
                <Field.Text name="Bairro" label="Bairro" />
                <Field.Text name="Cidade" label="Cidade" />
                <Field.Text name="Estado" label="Estado" />
                <Field.Text name="Cep" label="CEP" />
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {currentAcademia ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
