import type { IPlan } from 'src/features/gym-plans/types/plan';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid2, Typography, InputAdornment } from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useCreateAluno } from '../hooks';
import { Status, type IAluno } from '../types/aluno';
import { useListPlans } from '../hooks/use-list-plans';
import { useUpdateAluno } from '../hooks/use-update-aluno';
import { AlunoSchema, type AlunoSchemaType } from '../schemas/aluno-schema';

interface AlunoFormProps {
  open: boolean;
  onClose: VoidFunction;
  currentAluno?: IAluno | null;
}

export function AlunoForm({ open, onClose, currentAluno }: AlunoFormProps) {
  const { createAluno } = useCreateAluno();
  const { updateAluno } = useUpdateAluno();
  const { plans, isLoading: isLoadingPlans } = useListPlans();

  const defaultValues: AlunoSchemaType = {
    // Id: currentAluno?.Id || '',
    Nome: '',
    Email: '',
    Telefone: '',
    DataNascimento: '',
    CPF: '',
    Endereco: {
      Logradouro: '',
      Numero: '',
      Complemento: '',
      Bairro: '',
      Cidade: '',
      Estado: '',
      CEP: '',
    },
    Plano: {
      Id: '',
      Nome: '',
      Valor: 0,
      DataInicio: '',
      DataFim: '',
    },
    TreinadorId: '',
    Status: Status.PENDING,
    Foto: null,
    MaxBookings: 0,
  };

  const methods = useForm<AlunoSchemaType>({
    resolver: zodResolver(AlunoSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    trigger,
  } = methods;

  const selectedPlan = watch('Plano');
  const selectedStatus = watch('Status');

  const selectedPlanValue = useMemo(() => {
    return plans.find((plan: IPlan) => plan.Id === selectedPlan?.Id) || null;
  }, [plans, selectedPlan?.Id]);

  const statusIcon = useMemo(() => {
    switch (selectedStatus) {
      case Status.ACTIVE:
        return 'solar:check-circle-bold';
      case Status.INACTIVE:
        return 'solar:close-circle-bold';
      case Status.BLOCKED:
        return 'solar:forbidden-bold';
      default:
        return 'solar:clock-circle-bold';
    }
  }, [selectedStatus]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      console.log('[AlunoForm] - Dados recebidos do formulário:', data);

      // Remove empty strings and undefined values for partial updates
      const cleanData: Partial<AlunoSchemaType> = {};

      Object.entries(data).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) return;

        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
          // Handle nested objects (Endereco, Plano)
          const nestedObj = value as Record<string, any>;
          const hasValues = Object.values(nestedObj).some(
            (v) => v !== '' && v !== null && v !== undefined
          );

          if (hasValues) {
            const cleanedNested = Object.fromEntries(
              Object.entries(nestedObj).filter(
                ([_, v]) => v !== '' && v !== null && v !== undefined
              )
            );
            if (Object.keys(cleanedNested).length > 0) {
              (cleanData as any)[key] = cleanedNested;
            }
          }
        } else {
          (cleanData as any)[key] = value;
        }
      });

      console.log('[AlunoForm] - Dados limpos:', cleanData);

      if (currentAluno?.Id) {
        await updateAluno({ ...cleanData, Id: currentAluno.Id });
        console.log('[AlunoForm] - Dados enviados para atualização:', cleanData);
        toast.success('Aluno atualizado com sucesso!');
      } else {
        await createAluno(cleanData);
        console.log('[AlunoForm] - Dados enviados para criação:', cleanData);
        toast.success('Aluno criado com sucesso!');
      }

      reset();
      onClose();
    } catch (error) {
      console.error('[AlunoForm] - Erro ao salvar:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (currentAluno) {
      reset(adaptAlunoToForm(currentAluno));
    } else {
      reset(defaultValues);
    }
  }, [currentAluno, reset]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>{currentAluno ? 'Editar Aluno' : 'Novo Aluno'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid2 container spacing={3} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Field.UploadAvatar name="Foto" accept={{ 'image/*': [] }} maxSize={3145728} />

                <Field.Text
                  name="Nome"
                  label="Nome"
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:user-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Field.Text
                  name="Email"
                  label="Email"
                  type="email"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:letter-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Stack direction="row" spacing={2}>
                  <Field.Phone name="Telefone" label="Telefone" country="BR" />

                  <Field.Cpf
                    name="CPF"
                    label="CPF"
                    placeholder="000.000.000-00"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:id-card-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Field.DatePicker name="DataNascimento" label="Data de Nascimento" />

                  <Field.Select
                    name="Status"
                    label="Status"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon={statusIcon} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  >
                    <MenuItem value={Status.ACTIVE}>Ativo</MenuItem>
                    <MenuItem value={Status.INACTIVE}>Inativo</MenuItem>
                    <MenuItem value={Status.PENDING}>Pendente</MenuItem>
                    <MenuItem value={Status.BLOCKED}>Bloqueado</MenuItem>
                  </Field.Select>
                </Stack>

                <Field.Text
                  name="MaxBookings"
                  label="Quantidade de Agendamentos"
                  type="number"
                  placeholder="0"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:calendar-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Autocomplete
                  options={plans}
                  getOptionLabel={(option) => option.Nome}
                  value={selectedPlanValue}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setValue('Plano', {
                        Id: newValue.Id,
                        Nome: newValue.Nome,
                        Valor: newValue.Valor,
                        DataInicio: newValue.DataInicio,
                        DataFim: newValue.DataFim,
                      });
                      trigger('Plano');
                    } else {
                      setValue('Plano', {
                        Id: '',
                        Nome: '',
                        Valor: 0,
                        DataInicio: '',
                        DataFim: '',
                      });
                    }
                  }}
                  loading={isLoadingPlans}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Plano"
                      error={!!errors.Plano}
                      helperText={errors.Plano?.message}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:card-bold" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {isLoadingPlans ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">{option.Nome}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          R$ {option.Valor.toFixed(2)} - {option.Duracao} dias
                        </Typography>
                      </Stack>
                    </li>
                  )}
                />

                <Stack direction="row" spacing={2}>
                  <Field.DatePicker name="Plano.DataInicio" label="Data de Início do Plano" />

                  <Field.DatePicker name="Plano.DataFim" label="Data de Término do Plano" />
                </Stack>

                <Field.Text
                  name="Endereco.Logradouro"
                  label="Logradouro"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:map-point-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Field.Text
                  name="Endereco.Bairro"
                  label="Bairro"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:map-point-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Stack direction="row" spacing={2}>
                  <Field.Text
                    name="Endereco.Numero"
                    label="Número"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:hashtag-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Field.Text
                    name="Endereco.Complemento"
                    label="Complemento"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:home-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Field.Cep
                    name="Endereco.CEP"
                    label="CEP"
                    placeholder="00000-000"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:map-point-search-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Field.Text
                    name="Endereco.Cidade"
                    label="Cidade"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:city-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Field.Text
                    name="Endereco.Estado"
                    label="Estado"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:map-point-bold" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Grid2>
          </Grid2>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={onSubmit}
          startIcon={<Iconify icon={currentAluno ? 'solar:check-bold' : 'solar:add-bold'} />}
        >
          {currentAluno ? 'Salvar' : 'Criar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function adaptAlunoToForm(aluno: IAluno): AlunoSchemaType {
  return {
    Nome: aluno.Nome || '',
    Email: aluno.Email || '',
    Telefone: aluno.Telefone || '',
    DataNascimento: aluno.DataNascimento || '',
    CPF: aluno.CPF || '',
    Endereco: {
      Logradouro: aluno.Endereco.Logradouro || '',
      Numero: aluno.Endereco.Numero || '',
      Complemento: aluno.Endereco.Complemento || '',
      Bairro: aluno.Endereco.Bairro || '',
      Cidade: aluno.Endereco.Cidade || '',
      Estado: aluno.Endereco.Estado || '',
      CEP: aluno.Endereco.CEP || '',
    },
    Plano: {
      Id: aluno.Plano.Id || '',
      Nome: aluno.Plano.Nome || '',
      Valor: aluno.Plano.Valor || 0,
      DataInicio: aluno.Plano.DataInicio || '',
      DataFim: aluno.Plano.DataFim || '',
    },
    TreinadorId: aluno.Treinador?.Id || '',
    Status: aluno.Status as Status,
    Foto: aluno.Foto || null,
    MaxBookings: aluno.MaxBookings || 0,
  };
}
