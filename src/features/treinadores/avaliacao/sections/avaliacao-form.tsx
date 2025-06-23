'use client';

import type { Dayjs } from 'dayjs';

import { z } from 'zod';
import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';

import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  CardContent,
  Autocomplete,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';

import { useListAlunos } from 'src/features/alunos/hooks';
import { useEvaluationSlots } from 'src/features/treinadores/treinador/hooks';
import { useCreateAvaliacao, useUpdateAvaliacao } from 'src/features/treinadores/avaliacao/hooks';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { toast } from 'src/components/snackbar';
import { StatusAvaliacao } from '../types';
import { useAvaliacaoListViewStore } from '../stores/avaliacao-list-view.store';

import type { IAvaliacao } from '../types';
import { LoadingButton } from '@mui/lab';
// import { debounce } from 'lodash';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// ----------------------------------------------------------------------

const AvaliacaoSchema = z.object({
  Status: z.nativeEnum(StatusAvaliacao, { required_error: 'Status é obrigatório' }),
  TenantId: z.string().min(1, 'TenantId é obrigatório'),
  PerfilMembroId: z
    .object({
      Id: z.string(),
      UserId: z.string(),
      Nome: z.string(),
      Email: z.string(),
      Role: z.string(),
      Telefone: z.string().optional(),
      AvatarUrl: z.string().optional(),
      TenantId: z.string(),
      Status: z.string(),
    })
    .optional(),
  SlotAvaliacaoId: z
    .object({
      Id: z.string().optional(),
      start: z
        .union([z.date(), z.string()])
        .transform((val) => new Date(val))
        .optional(),
      end: z
        .union([z.date(), z.string()])
        .transform((val) => new Date(val))
        .optional(),
      location: z.string().optional(),
    })
    .optional(),
  Observacoes: z.string().optional(),
  DataCheckIn: z.string().optional(),
  Objetivos: z.array(z.string()).optional(),
  Restricoes: z.array(z.string()).optional(),
  HistoricoMedico: z.string().optional(),
  Medidas: z
    .object({
      Peso: z.number().optional(),
      Altura: z.number().optional(),
      IMC: z.number().optional(),
      GorduraCorporal: z.number().optional(),
      MassaMuscular: z.number().optional(),
    })
    .optional(),
});

type AvaliacaoSchemaType = z.infer<typeof AvaliacaoSchema>;

// ----------------------------------------------------------------------

interface AvaliacaoFormProps {
  open: boolean;
  onClose: VoidFunction;
  currentAvaliacao?: IAvaliacao | null;
  treinadorId: string;
}

export function AvaliacaoForm({
  open,
  onClose,
  currentAvaliacao,
  treinadorId,
}: AvaliacaoFormProps) {
  const { createAvaliacao } = useCreateAvaliacao(treinadorId);
  const { updateAvaliacao } = useUpdateAvaliacao(treinadorId);
  const { user } = useAuthContext();

  const { alunos, isLoading: isLoadingAlunos } = useListAlunos({
    limit: 100,
    page: 0,
    search: '',
    status: '',
    tenantId: user?.profile?.tenantId || '',
  });

  const defaultValues = useMemo(
    (): AvaliacaoSchemaType => ({
      Status: StatusAvaliacao.AGENDADA,
      TenantId: user?.profile?.tenantId || '',
      PerfilMembroId: undefined,
      SlotAvaliacaoId: {
        start: new Date(),
        end: new Date(),
        location: '',
      },
      Observacoes: '',
      DataCheckIn: '',
      Objetivos: [],
      Restricoes: [],
      HistoricoMedico: '',
      Medidas: {
        Peso: undefined,
        Altura: undefined,
        IMC: undefined,
        GorduraCorporal: undefined,
        MassaMuscular: undefined,
      },
    }),
    [user?.profile?.tenantId]
  );

  const adaptedValues = useMemo(() => {
    if (!currentAvaliacao) return undefined;
    return adaptAvaliacaoToForm(currentAvaliacao, user?.profile?.tenantId);
  }, [currentAvaliacao, user?.profile?.tenantId]);

  const methods = useForm<AvaliacaoSchemaType>({
    resolver: zodResolver(AvaliacaoSchema, {
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
    mode: 'onSubmit',
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  // Add debugging to see form values
  useEffect(() => {
    const subscription = watch((value) => {
      console.log('Form Values:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (open) {
      if (currentAvaliacao && adaptedValues) {
        reset(adaptedValues);
      } else {
        reset(defaultValues);
      }
    }
  }, [open, currentAvaliacao, adaptedValues, defaultValues, reset]);

  const watchedAlunoId = watch('PerfilMembroId.Id');
  const currentStatus = watch('Status');
  const isCompleted = currentStatus === StatusAvaliacao.REALIZADA;

  const selectedAluno = useMemo(
    () => alunos.find((a: any) => a.Id === watchedAlunoId) || null,
    [alunos, watchedAlunoId]
  );

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [timeValidation, setTimeValidation] = useState<{
    isValidating: boolean;
    hasConflict: boolean;
    conflicts: any[];
    message: string;
  }>({
    isValidating: false,
    hasConflict: false,
    conflicts: [],
    message: '',
  });

  const validateCustomTime = async (start: Date, end: Date) => {
    if (!start || !end || !showCustomTime) return;

    setTimeValidation((prev) => ({ ...prev, isValidating: true }));

    try {
      const response = await fetch(`/api/treinadores/${treinadorId}/validar-horario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({
          start: start.toISOString(),
          end: end.toISOString(),
          excludeSlotId: currentAvaliacao?.SlotAvaliacaoId?.Id,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Conflito detectado
        setTimeValidation({
          isValidating: false,
          hasConflict: true,
          conflicts: data.conflicts || [],
          message: data.message,
        });
      } else if (response.ok) {
        // Horário disponível
        setTimeValidation({
          isValidating: false,
          hasConflict: false,
          conflicts: [],
          message: 'Horário disponível',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao validar horário:', error);
      setTimeValidation({
        isValidating: false,
        hasConflict: false,
        conflicts: [],
        message: 'Erro ao validar horário',
      });
    }
  };

  // Watch for changes in custom time fields
  const watchedStart = watch('SlotAvaliacaoId.start');
  const watchedEnd = watch('SlotAvaliacaoId.end');

  useEffect(() => {
    if (showCustomTime && watchedStart && watchedEnd) {
      const timeoutId = setTimeout(() => {
        validateCustomTime(new Date(watchedStart), new Date(watchedEnd));
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [watchedStart, watchedEnd, showCustomTime]);

  // Fetch available slots when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableSlots();
    }
  }, [open, treinadorId]);

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // Buscar slots disponíveis do treinador
      const response = await fetch(`/api/treinadores/${treinadorId}/slots-disponiveis`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.slots || []);
      }
    } catch (error) {
      console.error('Erro ao buscar slots disponíveis:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotChange = (slotId: string) => {
    if (slotId === 'custom') {
      setShowCustomTime(true);
      setValue(
        'SlotAvaliacaoId',
        {
          Id: '',
          start: new Date(),
          end: new Date(),
          location: '',
        },
        { shouldValidate: true }
      );
    } else if (slotId === '') {
      // Manter horário atual - restaurar valores originais
      setShowCustomTime(false);
      if (currentAvaliacao?.SlotAvaliacaoId) {
        setValue(
          'SlotAvaliacaoId',
          {
            Id: currentAvaliacao.SlotAvaliacaoId.Id,
            start: currentAvaliacao.SlotAvaliacaoId.DataInicio
              ? dayjs(currentAvaliacao.SlotAvaliacaoId.DataInicio).toDate()
              : new Date(),
            end: currentAvaliacao.SlotAvaliacaoId.DataFim
              ? dayjs(currentAvaliacao.SlotAvaliacaoId.DataFim).toDate()
              : new Date(),
            location: currentAvaliacao.SlotAvaliacaoId.Local || '',
          },
          { shouldValidate: true }
        );
      }
    } else {
      setShowCustomTime(false);
      const selectedSlot = availableSlots.find((slot) => slot.$id === slotId);
      if (selectedSlot) {
        setValue(
          'SlotAvaliacaoId',
          {
            Id: selectedSlot.$id,
            start: new Date(selectedSlot.start),
            end: new Date(selectedSlot.end),
            location: selectedSlot.location,
          },
          { shouldValidate: true }
        );
      }
    }
  };

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        let submitData: any;

        if (currentAvaliacao?.Id) {
          // Quando editando, enviar apenas os campos editáveis
          submitData = {
            Status: data.Status,
            Observacoes: data.Observacoes || '',
            Objetivos: data.Objetivos || [],
            Restricoes: data.Restricoes || [],
            HistoricoMedico: data.HistoricoMedico || '',
            DataCheckIn: data.DataCheckIn
              ? dayjs(data.DataCheckIn).toISOString()
              : currentAvaliacao.DataCheckIn,
            // Manter os dados originais para campos não editáveis
            PerfilMembroId: data.PerfilMembroId
              ? {
                  Id: data.PerfilMembroId.Id,
                }
              : null,
          };

          // Incluir dados do slot apenas se foi alterado
          if (
            data.SlotAvaliacaoId &&
            (showCustomTime || data.SlotAvaliacaoId.Id !== currentAvaliacao.SlotAvaliacaoId.Id)
          ) {
            submitData.SlotAvaliacaoId = {
              Id: data.SlotAvaliacaoId.Id || '',
              start: data.SlotAvaliacaoId.start,
              end: data.SlotAvaliacaoId.end,
              location: data.SlotAvaliacaoId.location || 'Local a definir',
            };
          }
        } else {
          // Quando criando, enviar todos os dados
          submitData = {
            Status: data.Status,
            TenantId: data.TenantId,
            PerfilMembroId: data.PerfilMembroId
              ? {
                  Id: data.PerfilMembroId.Id,
                  UserId: data.PerfilMembroId.UserId,
                  Nome: data.PerfilMembroId.Nome,
                  Email: data.PerfilMembroId.Email,
                  Role: data.PerfilMembroId.Role,
                  Telefone: data.PerfilMembroId.Telefone,
                  AvatarUrl: data.PerfilMembroId.AvatarUrl,
                  TenantId: data.PerfilMembroId.TenantId,
                  Status: data.PerfilMembroId.Status,
                }
              : null,
            SlotAvaliacaoId: data.SlotAvaliacaoId
              ? {
                  Id: data.SlotAvaliacaoId.Id,
                  start: data.SlotAvaliacaoId.start,
                  end: data.SlotAvaliacaoId.end,
                  location: data.SlotAvaliacaoId.location || 'Local a definir',
                }
              : null,
            Observacoes: data.Observacoes || '',
            DataCheckIn: data.DataCheckIn
              ? dayjs(data.DataCheckIn).toISOString()
              : new Date().toISOString(),
            Objetivos: data.Objetivos || [],
            Restricoes: data.Restricoes || [],
            HistoricoMedico: data.HistoricoMedico || '',
            Medidas: data.Medidas,
          };
        }

        console.log('Submit Data:', submitData);

        if (currentAvaliacao?.Id) {
          await updateAvaliacao(currentAvaliacao.Id, submitData as any);
          toast.success('Avaliação atualizada com sucesso');
        } else {
          await createAvaliacao(submitData as any);
          toast.success('Avaliação criada com sucesso');
        }

        handleClose();
      } catch (error: any) {
        console.error('Erro ao salvar avaliação:', error);

        // Tratamento específico para conflitos de horário
        if (error?.message?.includes('Conflito de horário')) {
          toast.error(error.message);
        } else {
          toast.error('Erro ao salvar avaliação');
        }
      }
    },
    (validationErrors) => {
      console.log('Form Validation Errors:', validationErrors);
    }
  );

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  console.log('currentAvaliacao: ', currentAvaliacao);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentAvaliacao ? 'Editar' : 'Nova'} Avaliação</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Status */}
            <Field.Select name="Status" label="Status">
              {Object.values(StatusAvaliacao).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Field.Select>

            {/* Aluno */}
            <Autocomplete
              options={alunos}
              getOptionLabel={(option) => `${option.Nome} - ${option.CPF}`}
              value={selectedAluno}
              disabled={!!currentAvaliacao}
              onChange={(_, newValue) => {
                if (newValue) {
                  setValue(
                    'PerfilMembroId',
                    {
                      Id: newValue.Id,
                      UserId: newValue.Id,
                      Nome: newValue.Nome,
                      Email: newValue.Email,
                      Role: 'USER',
                      Telefone: newValue.Telefone,
                      AvatarUrl: newValue.Foto,
                      TenantId: newValue.TenantId,
                      Status: newValue.Status,
                    },
                    { shouldValidate: true }
                  );
                } else {
                  setValue('PerfilMembroId', undefined, { shouldValidate: true });
                }
              }}
              loading={isLoadingAlunos}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aluno"
                  error={!!errors.PerfilMembroId}
                  helperText={
                    errors.PerfilMembroId?.message ||
                    (currentAvaliacao
                      ? 'Não é possível alterar o aluno após criar a avaliação'
                      : '')
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingAlunos ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Stack>
                    <span>{option.Nome}</span>
                    <span style={{ fontSize: '0.8em', color: 'gray' }}>{option.CPF}</span>
                  </Stack>
                </li>
              )}
            />

            {/* Data de Check-in */}
            <Field.MobileDateTimePicker
              name="DataCheckIn"
              label="Data e Horário do Check-in"
              ampm={false}
              format="DD/MM/YYYY HH:mm"
            />

            {/* Horário Atual da Avaliação - apenas quando editando */}
            {currentAvaliacao && (
              <Stack spacing={2}>
                <Typography variant="h6">Horário da Avaliação</Typography>

                {/* Exibir horário atual */}
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Horário Atual:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {currentAvaliacao.SlotAvaliacaoId ? (
                        <>
                          {dayjs(currentAvaliacao.SlotAvaliacaoId.DataInicio).format(
                            'DD/MM/YYYY HH:mm'
                          )}{' '}
                          - {dayjs(currentAvaliacao.SlotAvaliacaoId.DataFim).format('HH:mm')}
                          {currentAvaliacao.SlotAvaliacaoId.Local &&
                            ` (${currentAvaliacao.SlotAvaliacaoId.Local})`}
                        </>
                      ) : (
                        'Horário não definido'
                      )}
                    </Typography>
                  </Stack>
                </Card>

                <Typography variant="h6">Alterar Horário da Avaliação</Typography>

                <FormControl fullWidth>
                  <InputLabel>Selecionar Horário</InputLabel>
                  <Select
                    value={watch('SlotAvaliacaoId.Id') || ''}
                    onChange={(e) => handleSlotChange(e.target.value)}
                    label="Selecionar Horário"
                  >
                    <MenuItem value="">Manter horário atual</MenuItem>
                    {availableSlots.length > 0
                      ? availableSlots.map((slot) => (
                          <MenuItem key={slot.$id} value={slot.$id}>
                            {dayjs(slot.start).format('DD/MM/YYYY HH:mm')} -{' '}
                            {dayjs(slot.end).format('HH:mm')}
                            {slot.location && ` (${slot.location})`}
                          </MenuItem>
                        ))
                      : !isLoadingSlots && (
                          <MenuItem disabled>Nenhum horário disponível encontrado</MenuItem>
                        )}
                    <MenuItem value="custom">Criar novo horário personalizado</MenuItem>
                  </Select>
                  {isLoadingSlots && (
                    <FormHelperText>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Carregando horários disponíveis...
                    </FormHelperText>
                  )}
                  {!isLoadingSlots && availableSlots.length === 0 && (
                    <FormHelperText>
                      Nenhum horário disponível encontrado. Use a opção personalizada para criar um
                      novo horário.
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            )}

            {/* Seleção de Horário para Nova Avaliação */}
            {!currentAvaliacao && (
              <Stack spacing={2}>
                <Typography variant="h6">Horário da Avaliação</Typography>

                <FormControl fullWidth>
                  <InputLabel>Selecionar Horário</InputLabel>
                  <Select
                    value={watch('SlotAvaliacaoId.Id') || ''}
                    onChange={(e) => handleSlotChange(e.target.value)}
                    label="Selecionar Horário"
                  >
                    <MenuItem value="">Selecione um horário</MenuItem>
                    {availableSlots.length > 0
                      ? availableSlots.map((slot) => (
                          <MenuItem key={slot.$id} value={slot.$id}>
                            {dayjs(slot.start).format('DD/MM/YYYY HH:mm')} -{' '}
                            {dayjs(slot.end).format('HH:mm')}
                            {slot.location && ` (${slot.location})`}
                          </MenuItem>
                        ))
                      : !isLoadingSlots && (
                          <MenuItem disabled>Nenhum horário disponível encontrado</MenuItem>
                        )}
                    <MenuItem value="custom">Criar horário personalizado</MenuItem>
                  </Select>
                  {isLoadingSlots && (
                    <FormHelperText>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Carregando horários disponíveis...
                    </FormHelperText>
                  )}
                  {!isLoadingSlots && availableSlots.length === 0 && (
                    <FormHelperText>
                      Nenhum horário disponível encontrado. Use a opção personalizada para criar um
                      novo horário.
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            )}

            {/* Horário Personalizado - apenas quando selecionado */}
            {showCustomTime && (
              <Stack spacing={2}>
                <Typography variant="h6">
                  {currentAvaliacao ? 'Novo Horário Personalizado' : 'Horário Personalizado'}
                </Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Field.MobileDateTimePicker
                    name="SlotAvaliacaoId.start"
                    label="Data e Hora de Início"
                    ampm={false}
                    format="DD/MM/YYYY HH:mm"
                  />
                  <Field.MobileDateTimePicker
                    name="SlotAvaliacaoId.end"
                    label="Data e Hora de Término"
                    ampm={false}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Stack>

                <Field.Text
                  name="SlotAvaliacaoId.location"
                  label="Local"
                  helperText={currentAvaliacao ? 'Novo local para o horário personalizado' : ''}
                />

                {/* Validação de Horário */}
                {showCustomTime && (
                  <Stack spacing={1}>
                    {timeValidation.isValidating && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Verificando disponibilidade...
                        </Typography>
                      </Stack>
                    )}

                    {!timeValidation.isValidating && timeValidation.message && (
                      <Stack spacing={1}>
                        <Typography
                          variant="body2"
                          color={timeValidation.hasConflict ? 'error' : 'success.main'}
                          sx={{ fontWeight: 'medium' }}
                        >
                          {timeValidation.message}
                        </Typography>

                        {timeValidation.hasConflict && timeValidation.conflicts.length > 0 && (
                          <Stack spacing={1} sx={{ pl: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Conflitos detectados:
                            </Typography>
                            {timeValidation.conflicts.map((conflict, index) => (
                              <Typography
                                key={index}
                                variant="body2"
                                color="error"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                • {dayjs(conflict.start).format('DD/MM/YYYY HH:mm')} -{' '}
                                {dayjs(conflict.end).format('HH:mm')} ({conflict.location}) -{' '}
                                {conflict.studentName}
                              </Typography>
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    )}
                  </Stack>
                )}
              </Stack>
            )}

            {/* Observações */}
            <Field.Text name="Observacoes" label="Observações" multiline rows={3} />

            {/* Objetivos */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={watch('Objetivos') || []}
              onChange={(_, newValue) => {
                setValue('Objetivos', newValue, { shouldValidate: true });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Objetivos"
                  placeholder="Digite um objetivo e pressione Enter"
                  helperText="Pressione Enter para adicionar cada objetivo"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
            />

            {/* Restrições */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={watch('Restricoes') || []}
              onChange={(_, newValue) => {
                setValue('Restricoes', newValue, { shouldValidate: true });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Restrições"
                  placeholder="Digite uma restrição e pressione Enter"
                  helperText="Pressione Enter para adicionar cada restrição"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
            />

            {/* Histórico Médico */}
            <Field.Text name="HistoricoMedico" label="Histórico Médico" multiline rows={3} />

            {/* Informação sobre campos editáveis - apenas informativo quando editando */}
            {currentAvaliacao && (
              <Stack spacing={1} sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Campos Editáveis:</strong> Status, Data/Hora de Check-in, Horários da
                  avaliação, Local, Observações, Objetivos, Restrições e Histórico Médico.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Campos Não Editáveis:</strong> Aluno selecionado e medidas físicas (devem
                  ser registradas separadamente).
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Alteração de Horários:</strong> Você pode selecionar um horário disponível
                  existente ou criar um novo horário personalizado. O sistema verificará
                  automaticamente conflitos com outros agendamentos.
                </Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={timeValidation.hasConflict}
          >
            {currentAvaliacao ? 'Salvar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function adaptAvaliacaoToForm(avaliacao: IAvaliacao, tenantId?: string): AvaliacaoSchemaType {
  return {
    Status: avaliacao.Status,
    TenantId: avaliacao.TenantId || tenantId || '',
    PerfilMembroId: avaliacao.PerfilMembroId
      ? {
          Id: avaliacao.PerfilMembroId.Id,
          UserId: avaliacao.PerfilMembroId.UserId,
          Nome: avaliacao.PerfilMembroId.Nome,
          Email: avaliacao.PerfilMembroId.Email,
          Role: avaliacao.PerfilMembroId.Role,
          Telefone: avaliacao.PerfilMembroId.Telefone,
          AvatarUrl: avaliacao.PerfilMembroId.AvatarUrl,
          TenantId: avaliacao.PerfilMembroId.TenantId,
          Status: avaliacao.PerfilMembroId.Status,
        }
      : undefined,
    SlotAvaliacaoId: {
      Id: avaliacao.SlotAvaliacaoId?.Id,
      start: avaliacao.SlotAvaliacaoId?.DataInicio
        ? dayjs(avaliacao.SlotAvaliacaoId.DataInicio).toDate()
        : new Date(),
      end: avaliacao.SlotAvaliacaoId?.DataFim
        ? dayjs(avaliacao.SlotAvaliacaoId.DataFim).toDate()
        : new Date(),
      location: avaliacao.SlotAvaliacaoId?.Local || '',
    },
    Observacoes: avaliacao.Observacoes || '',
    DataCheckIn: avaliacao.DataCheckIn
      ? dayjs(avaliacao.DataCheckIn).format('YYYY-MM-DDTHH:mm')
      : '',
    Objetivos: Array.isArray(avaliacao.Objetivos) ? avaliacao.Objetivos : [],
    Restricoes: Array.isArray(avaliacao.Restricoes) ? avaliacao.Restricoes : [],
    HistoricoMedico: avaliacao.HistoricoMedico || '',
    Medidas: {
      Peso: undefined,
      Altura: undefined,
      IMC: undefined,
      GorduraCorporal: undefined,
      MassaMuscular: undefined,
    },
  };
}
