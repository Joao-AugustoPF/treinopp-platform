'use client';

import type { ITreinador } from 'src/features/treinadores/treinador/types';

import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { TipoAula } from '../types';
import { useAulaListViewStore } from '../stores/aula-list-view.store';
import { AulaSchema, type AulaSchemaType } from '../schemas/aula-schema';
import { useCreateAula, useUpdateAula, useListTreinadores } from '../hooks';

import type { IAula } from '../types';

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export function AulaForm({ open, onClose }: Props) {
  const { currentAula, setCurrentAula } = useAulaListViewStore();
  const { createAula } = useCreateAula();
  const { updateAula } = useUpdateAula();
  const { treinadores, isLoading: isLoadingTreinadores } = useListTreinadores();

  const { user } = useAuthContext();

  const profile = user?.profile;

  const defaultValues: AulaSchemaType = {
    Nome: '',
    TipoAula: TipoAula.YOGA,
    TreinadorId: '',
    DataInicio: new Date().toISOString(),
    DataFim: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    Local: '',
    Capacidade: 4,
    TenantId: profile?.tenantId || '',
    Status: 'scheduled' as const,
  };

  const methods = useForm<AulaSchemaType>({
    resolver: zodResolver(AulaSchema, {
      errorMap: (issue, ctx) => {
        console.log('Zod Validation Error:', {
          issue,
          ctx,
          path: issue.path,
          message: issue.message,
        });
        return { message: issue.message || 'Campo inválido' };
      },
    }),
    defaultValues,
    values: currentAula ? adaptAulaToForm(currentAula) : undefined,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // Log form errors whenever they change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form Validation Errors:', errors);
    }
  }, [errors]);

  // Reset form when currentAula changes
  useEffect(() => {
    if (currentAula) {
      try {
        const adaptedData = adaptAulaToForm(currentAula);
        console.log('Adapted Aula Data:', adaptedData);
        methods.reset(adaptedData);
      } catch (error) {
        console.error('Error adapting aula data:', error);
      }
    } else {
      methods.reset(defaultValues);
    }
  }, [currentAula, methods]);

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        console.log('Form Data before submission:', data);

        const selectedTreinador = treinadores.find((t) => t.Id === data.TreinadorId);

        if (!selectedTreinador) {
          throw new Error('Treinador não encontrado');
        }

        if (!profile?.tenantId) {
          throw new Error('Tenant ID não encontrado');
        }

        const aulaData: Omit<IAula, 'Id' | 'CreatedAt' | 'UpdatedAt'> = {
          Nome: data.Nome,
          TipoAula: data.TipoAula,
          TreinadorId: selectedTreinador.Id,
          DataInicio: data.DataInicio,
          DataFim: data.DataFim,
          Local: data.Local,
          Capacidade: data.Capacidade,
          Status: data.Status,
          CreatedBy: currentAula?.CreatedBy || '',
          UpdatedBy: currentAula?.UpdatedBy || '',
          IsDeleted: currentAula?.IsDeleted || false,
          TenantId: profile.tenantId,
        };

        console.log('Aula Data to be saved:', aulaData);

        if (currentAula?.Id) {
          await updateAula(currentAula.Id, aulaData);
        } else {
          await createAula(aulaData);
        }
        handleClose();
      } catch (error) {
        console.error('Error saving aula:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
          });
        }
      }
    },
    (validationErrors) => {
      console.error('Form validation failed:', validationErrors);
      Object.entries(validationErrors).forEach(([field, error]) => {
        console.error(`Field ${field}:`, error);
      });
    }
  );

  const handleClose = useCallback(() => {
    reset();
    setCurrentAula(null);
    onClose();
  }, [onClose, reset, setCurrentAula]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentAula ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Field.Text name="Nome" label="Nome" autoFocus />

            <Field.Select name="TipoAula" label="Tipo de Aula">
              {Object.values(TipoAula).map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select
              name="TreinadorId"
              label="Treinador"
              disabled={isLoadingTreinadores}
              InputProps={{
                endAdornment: isLoadingTreinadores ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null,
              }}
            >
              {treinadores.map((treinador: ITreinador) => (
                <MenuItem key={treinador.Id} value={treinador.Id}>
                  {treinador.Nome}
                </MenuItem>
              ))}
            </Field.Select>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              <Field.MobileDateTimePicker
                name="DataInicio"
                label="Data e Hora de Início"
                format="DD/MM/YYYY HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false,
                  },
                }}
              />

              <Field.MobileDateTimePicker
                name="DataFim"
                label="Data e Hora de Término"
                format="DD/MM/YYYY HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: false,
                  },
                }}
              />
            </Box>

            <Field.Text name="Local" label="Local" />

            <Field.Text
              name="Capacidade"
              label="Capacidade"
              type="number"
              inputProps={{ min: 1 }}
            />

            <Field.Select name="Status" label="Status">
              <MenuItem value="scheduled">Agendada</MenuItem>
              <MenuItem value="confirmed">Confirmada</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluída</MenuItem>
              <MenuItem value="cancelled">Cancelada</MenuItem>
              <MenuItem value="no_show">Ausente</MenuItem>
            </Field.Select>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentAula ? 'Salvar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

function adaptAulaToForm(aula: IAula): AulaSchemaType {
  try {
    console.log('Adapting aula to form:', aula);

    const treinadorId =
      typeof aula.TreinadorId === 'object'
        ? (aula.TreinadorId as { $id: string }).$id
        : aula.TreinadorId;

    const adaptedData = {
      Nome: aula.Nome,
      TipoAula: aula.TipoAula,
      TreinadorId: treinadorId,
      TenantId: aula.TenantId,
      DataInicio: aula.DataInicio,
      DataFim: aula.DataFim,
      Local: aula.Local,
      Capacidade: aula.Capacidade,
      Status: aula.Status,
    };

    console.log('Adapted data:', adaptedData);
    return adaptedData;
  } catch (error) {
    console.error('Error in adaptAulaToForm:', error);
    throw error;
  }
}
