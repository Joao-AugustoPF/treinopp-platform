'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field } from 'src/components/hook-form';

import {
  Grid,
  Stack,
  Dialog,
  Button,
  MenuItem,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';

import { useCreateTreinador, useUpdateTreinador, useCheckTrainerEmail } from '../hooks/use-treinador';

import { StatusTreinador } from '../types';
import { useTreinadorListViewStore } from '../stores/treinador-list-view.store';

// ----------------------------------------------------------------------

const schema = z.object({
  Id: z.string().optional(),
  Nome: z.string().min(1, 'Nome é obrigatório'),
  Email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  Telefone: z.string().min(1, 'Telefone é obrigatório'),
  DataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  CPF: z.string().nullable(),
  Status: z.nativeEnum(StatusTreinador, { required_error: 'Status é obrigatório' }),
  Foto: z.string().nullable(),
  Endereco: z.object({
    Cep: z.string().min(1, 'CEP é obrigatório'),
    Logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    Numero: z.string().min(1, 'Número é obrigatório'),
    Complemento: z.string().nullable(),
    Bairro: z.string().min(1, 'Bairro é obrigatório'),
    Cidade: z.string().min(1, 'Cidade é obrigatória'),
    Estado: z.string().min(1, 'Estado é obrigatório'),
  }),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  Nome: '',
  Email: '',
  Telefone: '',
  DataNascimento: '',
  CPF: '',
  Status: 'Ativo' as StatusTreinador,
  Foto: '',
  Endereco: {
    Cep: '',
    Logradouro: '',
    Numero: '',
    Complemento: '',
    Bairro: '',
    Cidade: '',
    Estado: '',
  },
};

// ----------------------------------------------------------------------

type Props = {
  dialog: {
    value: boolean;
    onTrue: VoidFunction;
    onFalse: VoidFunction;
  };
  readOnly?: boolean;
};

export function TreinadorForm({ dialog, readOnly }: Props) {
  const { currentTreinador, setCurrentTreinador } = useTreinadorListViewStore();
  const { createTreinador } = useCreateTreinador();
  const { updateTreinador } = useUpdateTreinador();
  const { checkTrainerEmail } = useCheckTrainerEmail();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const handleClose = () => {
    dialog.onFalse();
    reset(defaultValues);
    setCurrentTreinador(null);
    clearErrors();
  };

  const validateEmail = async (email: string) => {
    if (!email || currentTreinador?.Email === email) return true;
    
    const result = await checkTrainerEmail(email);
    return !result.exists;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validar email único apenas para novos treinadores ou quando o email foi alterado
      if (!currentTreinador || currentTreinador.Email !== data.Email) {
        const isEmailValid = await validateEmail(data.Email);
        if (!isEmailValid) {
          setError('Email', { 
            type: 'manual', 
            message: 'Este email já está sendo usado por outro treinador' 
          });
          return;
        }
      }

      if (currentTreinador) {
        await updateTreinador(currentTreinador.Id, data as any);
      } else {
        await createTreinador(data as any);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      // Handle error - could set a form error here
    }
  });

  useEffect(() => {
    if (!currentTreinador) return;
    reset({
      ...currentTreinador,
      Status: currentTreinador.Status as any,
      Endereco: currentTreinador.Endereco || defaultValues.Endereco,
    });
  }, [currentTreinador, reset]);

  return (
    <Dialog open={dialog.value} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {readOnly
          ? 'Detalhes do Treinador'
          : currentTreinador
            ? 'Editar Treinador'
            : 'Novo Treinador'}
      </DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Dados pessoais */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="Nome" label="Nome" disabled={readOnly} />
                
                <Field.Text 
                  name="Email" 
                  label="Email" 
                  disabled={readOnly}
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                />
                
                <Field.Text name="Telefone" label="Telefone" disabled={readOnly} />
                <Field.Cpf name="CPF" label="CPF" disabled={readOnly} />
                <Field.DatePicker
                  name="DataNascimento"
                  label="Data de Nascimento"
                  disabled={readOnly}
                />

                <Field.Select name="Status" label="Status" disabled={readOnly}>
                  {Object.values(StatusTreinador).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>
            </Grid>

            {/* Foto */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="Foto" label="URL da Foto" disabled={readOnly} />
              </Stack>
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Field.Text name="Endereco.Cep" label="CEP" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field.Text name="Endereco.Logradouro" label="Logradouro" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Field.Text name="Endereco.Numero" label="Número" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field.Text name="Endereco.Complemento" label="Complemento" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field.Text name="Endereco.Bairro" label="Bairro" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Field.Text name="Endereco.Cidade" label="Cidade" disabled={readOnly} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Field.Text name="Endereco.Estado" label="Estado" disabled={readOnly} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {errors.Email && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.Email.message}
            </Alert>
          )}
        </Form>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          {readOnly ? 'Fechar' : 'Cancelar'}
        </Button>

        {!readOnly && (
          <Button type="submit" variant="contained" onClick={onSubmit} disabled={isSubmitting}>
            {currentTreinador ? 'Salvar' : 'Criar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
