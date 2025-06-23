'use client';

import type { Dayjs } from 'dayjs';

import { z } from 'zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';

import { TipoAula } from 'src/features/aulas/types';
import { useListAlunos } from 'src/features/alunos/hooks';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { TipoEvento } from '../types/calendar';
import {
  useCreateAgenda,
  useUpdateAgenda,
  useDeleteAgenda,
  useCreateAvaliacao,
  useEvaluationSlots,
} from '../hooks';

import type { AgendaCreateSchemaType } from '../types';

const schema = z
  .object({
    Id: z.string().optional(),
    Titulo: z.string().min(1, 'Título é obrigatório'),
    TreinadorId: z.string().min(1, 'Treinador é obrigatório'),
    DataInicio: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
    DataFim: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
    Local: z.string().min(1, 'Local é obrigatório'),
    TipoEvento: z.nativeEnum(TipoEvento, { required_error: 'Tipo de evento é obrigatório' }),
    TipoAula: z
      .nativeEnum(TipoAula, {
        required_error: 'Tipo de aula é obrigatório',
      })
      .optional(),
    CapacidadeMaxima: z.number().min(0).optional(),
    VagasDisponiveis: z.number().min(0).optional(),
    AlunoId: z
      .union([z.string(), z.object({ $id: z.string() })])
      .transform((val) => (typeof val === 'string' ? val : val.$id))
      .optional(),
    Observacao: z.string().optional(),
    isBooking: z.boolean().optional(),
    bookingId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { DataInicio, DataFim, TipoEvento: eventType, AlunoId } = data;
    if (DataFim <= DataInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data/hora de término deve ser posterior à data/hora de início',
        path: ['DataFim'],
      });
    }
    if (eventType === TipoEvento.AVALIACAO && !AlunoId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Aluno é obrigatório para avaliação',
        path: ['AlunoId'],
      });
    }
    return true;
  });

export type AgendaFormValues = z.infer<typeof schema>;

const EMPTY_VALUES: AgendaFormValues = {
  Id: '',
  Titulo: '',
  TreinadorId: '',
  DataInicio: new Date(),
  DataFim: new Date(),
  Local: '',
  TipoEvento: TipoEvento.AULA,
  TipoAula: undefined,
  CapacidadeMaxima: 0,
  VagasDisponiveis: 0,
  AlunoId: '',
  Observacao: '',
  isBooking: false,
  bookingId: '',
};

interface Props {
  open: boolean;
  onClose: VoidFunction;
  isEditing: boolean;
  defaultValues?: Omit<AgendaFormValues, 'AlunoId'> & {
    HoraInicio?: string;
    HoraFim?: string;
    AlunoId?: string | { $id: string };
  };
  treinadorId: string;
}

interface EvaluationSlot {
  $id: string;
  start: string;
  end: string;
  location: string;
}

export function AgendaForm({
  open,
  onClose,
  isEditing,
  defaultValues: propDefaults,
  treinadorId,
}: Props) {
  // Para visualização apenas, vamos considerar que só permitimos edição se for criação de novo evento
  const isViewOnly = isEditing; // Quando isEditing=true, significa que está visualizando um evento existente
  const isCreating = !isEditing; // Quando isEditing=false, significa que está criando um novo evento

  // Hooks for CRUD
  const { createAgenda } = useCreateAgenda();
  const { updateAgenda } = useUpdateAgenda();
  const { deleteAgenda } = useDeleteAgenda();
  const { createAvaliacao } = useCreateAvaliacao();
  const { checkSlotAvailability } = useEvaluationSlots(treinadorId);
  const { slots: availableSlots, isLoading: isLoadingSlots } = useEvaluationSlots(treinadorId);

  // Auth & alunos
  const { user } = useAuthContext();
  const profile = user?.profile;
  const { alunos, isLoading: isLoadingAlunos } = useListAlunos({
    limit: 100,
    search: '',
    status: '',
    tenantId: profile?.tenantId,
    page: 1,
  });

  // Local state
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<EvaluationSlot | null>(null);
  const [filterDate, setFilterDate] = useState<Dayjs | null>(dayjs());

  // Build initial form values only once (or when propDefaults change)
  const initialFormValues = useMemo(() => {
    if (!propDefaults) {
      return { ...EMPTY_VALUES, TreinadorId: treinadorId };
    }

    // Parse DataInicio/DataFim and times if provided
    let inicio = EMPTY_VALUES.DataInicio;
    let fim = EMPTY_VALUES.DataFim;
    if (propDefaults.DataInicio && propDefaults.HoraInicio) {
      inicio = new Date(`${propDefaults.DataInicio}T${propDefaults.HoraInicio}`);
      fim =
        propDefaults.DataFim && propDefaults.HoraFim
          ? new Date(`${propDefaults.DataFim}T${propDefaults.HoraFim}`)
          : inicio;
    }

    const alunoIdRaw = propDefaults.AlunoId
      ? typeof propDefaults.AlunoId === 'string'
        ? propDefaults.AlunoId
        : propDefaults.AlunoId.$id
      : '';

    return {
      ...EMPTY_VALUES,
      ...propDefaults,
      DataInicio: inicio,
      DataFim: fim,
      TreinadorId: treinadorId,
      AlunoId: alunoIdRaw,
    };
  }, [propDefaults, treinadorId]);

  // React Hook Form setup
  const methods = useForm<AgendaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const tipoEvento = watch('TipoEvento');
  const isAula = tipoEvento === TipoEvento.AULA;
  const isAvaliacao = tipoEvento === TipoEvento.AVALIACAO;
  const watchedAlunoId = watch('AlunoId');

  // Derive selectedAluno from alunos list and watchedAlunoId
  const selectedAluno = useMemo(
    () => alunos.find((a: any) => a.Id === watchedAlunoId) || null,
    [alunos, watchedAlunoId]
  );

  // Format slots filtered by filterDate
  const filteredSlots = useMemo(() => {
    if (!filterDate) return availableSlots;
    return availableSlots.filter((slot: EvaluationSlot) => {
      const slotDate = dayjs(slot.start);
      return (
        slotDate.date() === filterDate.date() &&
        slotDate.month() === filterDate.month() &&
        slotDate.year() === filterDate.year()
      );
    });
  }, [availableSlots, filterDate]);

  // Handler: when user selects a slot, update form fields
  const handleSlotSelect = (slot: EvaluationSlot) => {
    setSelectedSlot(slot);
    const startDate = dayjs(slot.start).toDate();
    const endDate = dayjs(slot.end).toDate();
    setValue('DataInicio', startDate, { shouldValidate: true });
    setValue('DataFim', endDate, { shouldValidate: true });
    setValue('Local', slot.location, { shouldValidate: true });
  };

  // On submit
  const onSubmit = handleSubmit(
    async (data) => {
      // Não permitir submit em modo de visualização
      if (isViewOnly) {
        return;
      }

      try {
        let formattedData: AgendaCreateSchemaType = {
          Titulo: data.Titulo,
          TreinadorId: data.TreinadorId,
          DataInicio: dayjs(data.DataInicio).format('YYYY-MM-DD'),
          HoraInicio: dayjs(data.DataInicio).format('HH:mm'),
          DataFim: dayjs(data.DataFim).format('YYYY-MM-DD'),
          HoraFim: dayjs(data.DataFim).format('HH:mm'),
          Local: data.Local,
          TipoEvento: data.TipoEvento,
          TipoAula: data.TipoAula,
          CapacidadeMaxima: data.CapacidadeMaxima || 0,
          VagasDisponiveis: data.VagasDisponiveis || 0,
          AlunoId: data.AlunoId,
          Observacao: data.Observacao,
        };

        if (isAvaliacao && selectedSlot && !isEditing) {
          formattedData = {
            ...formattedData,
            DataInicio: dayjs(selectedSlot.start).format('YYYY-MM-DD'),
            HoraInicio: dayjs(selectedSlot.start).format('HH:mm'),
            DataFim: dayjs(selectedSlot.end).format('YYYY-MM-DD'),
            HoraFim: dayjs(selectedSlot.end).format('HH:mm'),
            Local: selectedSlot.location,
          };
        }

        if (isEditing) {
          if (!data.Id) throw new Error('ID é necessário para atualizar o evento');
          await updateAgenda(data.Id, formattedData);
        } else {
          if (data.TipoEvento === TipoEvento.AVALIACAO) {
            await createAvaliacao(formattedData);
          } else {
            await createAgenda(formattedData);
          }
        }

        onClose();
        reset(EMPTY_VALUES);
      } catch (error: any) {
        console.error('Erro ao submeter formulário:', error);
      }
    },
    (validationErrors) => {
      console.error('Erros de validação:', validationErrors);
    }
  );

  // Delete handler
  const handleDelete = async () => {
    if (!propDefaults?.Id) return;
    const isEvaluation = propDefaults.TipoEvento === TipoEvento.AVALIACAO;
    try {
      if (isEvaluation && !propDefaults.bookingId) {
        throw new Error('ID do agendamento não encontrado para avaliação');
      }
      await deleteAgenda(propDefaults.Id, {
        TreinadorId: treinadorId,
        isBooking: isEvaluation || !!propDefaults.isBooking,
        bookingId: propDefaults.bookingId,
      });
      onClose();
      reset(EMPTY_VALUES);
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isViewOnly ? 'Visualizar Evento' : 'Novo Evento'}</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.Text name="Titulo" label="Título" disabled={isViewOnly} />
                <Field.Select name="TipoEvento" label="Tipo de Evento" disabled={isViewOnly}>
                  <MenuItem value={TipoEvento.AULA}>Aula</MenuItem>
                  <MenuItem value={TipoEvento.AVALIACAO}>Avaliação</MenuItem>
                </Field.Select>

                {isAula && (
                  <Field.Select name="TipoAula" label="Tipo de Aula" disabled={isViewOnly}>
                    {Object.values(TipoAula).map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Field.Select>
                )}

                {isAvaliacao && (
                  <Autocomplete
                    options={alunos}
                    getOptionLabel={(option) => `${option.Nome} - ${option.CPF}`}
                    value={selectedAluno}
                    onChange={(_, newValue) => {
                      if (!isViewOnly) {
                        setValue('AlunoId', newValue?.Id || '', { shouldValidate: true });
                      }
                    }}
                    disabled={isViewOnly}
                    loading={isLoadingAlunos}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aluno"
                        error={!!errors.AlunoId}
                        helperText={errors.AlunoId?.message}
                        disabled={isViewOnly}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingAlunos ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div>
                          <div>{option.Nome}</div>
                          <div style={{ fontSize: '0.8em', color: 'gray' }}>{option.CPF}</div>
                        </div>
                      </li>
                    )}
                  />
                )}

                {isAvaliacao && !isViewOnly && !showCustomTime && (
                  <>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="subtitle1">Horários Disponíveis</Typography>
                      <DatePicker
                        value={filterDate}
                        onChange={(newValue: Dayjs | null) => setFilterDate(newValue)}
                        slotProps={{
                          textField: { size: 'small', sx: { width: 200 } },
                        }}
                      />
                    </Stack>

                    {isLoadingSlots ? (
                      <CircularProgress />
                    ) : filteredSlots.length > 0 ? (
                      <Grid container spacing={2}>
                        {filteredSlots.map((slot: any) => (
                          <Grid item xs={12} sm={6} md={4} key={slot.$id}>
                            <Card
                              sx={{
                                cursor: 'pointer',
                                bgcolor:
                                  selectedSlot?.$id === slot.$id
                                    ? 'action.selected'
                                    : 'background.paper',
                                '&:hover': { bgcolor: 'action.hover' },
                                height: '100%',
                              }}
                              onClick={() => handleSlotSelect(slot)}
                            >
                              <CardContent>
                                <Typography variant="subtitle2">
                                  {slot.start.split('T')[0].split('-').reverse().join('/')}
                                </Typography>
                                <Typography variant="subtitle2" color="primary">
                                  {slot.start.split('T')[1].substring(0, 5)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Local: {slot.location}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography color="text.secondary">
                        {filterDate
                          ? 'Nenhum horário disponível para esta data'
                          : 'Nenhum horário disponível'}
                      </Typography>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => setShowCustomTime(true)}
                      sx={{ mt: 2 }}
                    >
                      Definir Horário Personalizado
                    </Button>
                  </>
                )}

                {isAvaliacao && !isViewOnly && showCustomTime && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowCustomTime(false)}
                    sx={{ mt: 2 }}
                  >
                    ← Voltar para Horários Disponíveis
                  </Button>
                )}

                {(!isAvaliacao || showCustomTime || isViewOnly) && (
                  <Field.Text name="Local" label="Local" disabled={isViewOnly} />
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {(!isAvaliacao || showCustomTime || isViewOnly) && (
                  <>
                    <Field.MobileDateTimePicker
                      name="DataInicio"
                      label="Data e Hora de Início"
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      disabled={isViewOnly}
                    />
                    <Field.MobileDateTimePicker
                      name="DataFim"
                      label="Data e Hora de Término"
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      disabled={isViewOnly}
                    />
                  </>
                )}
              </Stack>
            </Grid>

            {isAula && (
              <Grid item xs={12}>
                <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
                  <Field.Text
                    name="CapacidadeMaxima"
                    label="Capacidade Máxima"
                    type="number"
                    disabled={isViewOnly}
                  />
                </Stack>
              </Grid>
            )}

            <Grid item xs={12}>
              <Field.Text
                name="Observacao"
                label="Observações"
                multiline
                rows={3}
                disabled={isViewOnly}
              />
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        {isViewOnly ? (
          <Button variant="outlined" onClick={onClose} sx={{ ml: 'auto' }}>
            Fechar
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={onClose} sx={{ ml: 'auto' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              Criar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
