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

import { useCreateUnidade, useUpdateUnidade } from '../hooks';
import { useUnidadeListViewStore } from '../stores/unidade-list-view.store';

const schema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  NomeExibicao: z.string().min(1, 'Nome de exibição é obrigatório'),
  SiglaUnidade: z.string().min(1, 'Sigla é obrigatória'),
  Telefone: z.string().min(8, 'Telefone é obrigatório'),
  Email: z.string().email('Email inválido'),
  Logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  LogradouroNumero: z.string().min(1, 'Número é obrigatório'),
  Cep: z.string().min(8, 'CEP é obrigatório'),
  Cidade: z.string().min(1, 'Cidade é obrigatória'),
  Estado: z.string().min(2, 'Estado é obrigatório'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  dialog: UseBooleanReturn;
};

const defaultValues: FormValues = {
  Nome: '',
  NomeExibicao: '',
  Email: '',
  Logradouro: '',
  Cep: '',
  Cidade: '',
  Estado: '',
  LogradouroNumero: '',
  Telefone: '',
  SiglaUnidade: '',
};

export function UnidadeForm({ dialog }: Props) {
  const { currentUnidade, setCurrentUnidade } = useUnidadeListViewStore();

  const { createUnidade } = useCreateUnidade();
  const { updateUnidade } = useUpdateUnidade();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUnidade) {
        await updateUnidade(currentUnidade.Id, data);
      } else {
        await createUnidade(data);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    dialog.onFalse();
    reset(defaultValues);
    setCurrentUnidade(null);
  };

  useEffect(() => {
    if (!currentUnidade) return;
    reset(currentUnidade);
  }, [currentUnidade, reset]);

  return (
    <Dialog open={dialog.value} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{currentUnidade ? 'Editar Unidade' : 'Nova Unidade'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="nome" label="Nome da Unidade" />
                <Field.Text name="nomeExibicao" label="Nome de Exibição" />
                <Field.Text name="siglaUnidade" label="Sigla" />
                <Field.Text name="telefone" label="Telefone" />
                <Field.Text name="email" label="Email" />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="logradouro" label="Logradouro" />
                <Field.Text name="logradouroNumero" label="Número" />
                <Field.Text name="cep" label="CEP" />
                <Field.Text name="cidade" label="Cidade" />
                <Field.Text name="estado" label="Estado" />
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
          {currentUnidade ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
