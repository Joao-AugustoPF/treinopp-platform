import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDay, parseISO, eachDayOfInterval } from 'date-fns';

import {
  Box,
  Chip,
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  CardContent,
  Autocomplete,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import {
  useListDisponibilidade,
  useCreateDisponibilidade,
  useDeleteDisponibilidade,
} from '../hooks/use-disponibilidade';

const disponibilidadeSchema = z
  .object({
    start: z.string().min(1, 'Horário de início é obrigatório'),
    end: z.string().min(1, 'Horário de fim é obrigatório'),
    location: z.string().min(1, 'Local é obrigatório'),
    tenantId: z.string().min(1, 'Tenant ID é obrigatório'),
    selectedDays: z.array(z.number()).min(1, 'Selecione pelo menos um dia da semana'),
    month: z.string().min(1, 'Selecione o mês'),
    year: z.string().min(1, 'Selecione o ano'),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.start}`);
      const endTime = new Date(`2000-01-01T${data.end}`);
      return endTime > startTime;
    },
    {
      message: 'O horário de fim deve ser posterior ao horário de início',
      path: ['end'],
    }
  );

type DisponibilidadeFormValues = z.infer<typeof disponibilidadeSchema>;

type DisponibilidadeFormProps = {
  open: boolean;
  onClose: () => void;
  treinadorId: string;
  tenantId: string;
  disponibilidades: Array<{
    tenantId: string;
    start: string;
    end: string;
    location: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    trainerProfileId: string;
    $databaseId: string;
    $collectionId: string;
  }>;
  isLoading: boolean;
};

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const MONTHS = [
  { value: '0', label: 'Janeiro' },
  { value: '1', label: 'Fevereiro' },
  { value: '2', label: 'Março' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Maio' },
  { value: '5', label: 'Junho' },
  { value: '6', label: 'Julho' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Setembro' },
  { value: '9', label: 'Outubro' },
  { value: '10', label: 'Novembro' },
  { value: '11', label: 'Dezembro' },
];

// Lista de locais comuns para avaliações
const COMMON_LOCATIONS = [
  'Academia Principal',
  'Sala de Avaliação',
  'Sala de Treino',
  'Área de Musculação',
  'Área de Cardio',
  'Sala de Aulas',
  'Espaço Funcional',
];

export function DisponibilidadeForm({
  open,
  onClose,
  treinadorId,
  tenantId,
  disponibilidades,
  isLoading,
}: DisponibilidadeFormProps) {
  const isSubmitting = useBoolean();
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const { createDisponibilidade } = useCreateDisponibilidade();
  const { deleteDisponibilidade } = useDeleteDisponibilidade();
  const { mutate } = useListDisponibilidade(treinadorId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DisponibilidadeFormValues>({
    resolver: zodResolver(disponibilidadeSchema),
    defaultValues: {
      tenantId,
      selectedDays: [],
      start: '',
      end: '',
      location: '',
      month: selectedMonth,
      year: selectedYear,
    },
    mode: 'onChange',
  });

  // Ensure tenantId is always set
  useEffect(() => {
    setValue('tenantId', tenantId);
  }, [tenantId, setValue]);

  // Add form values watcher
  const formValues = watch();
  const isFormValid = useMemo(
    () =>
      formValues.selectedDays?.length > 0 &&
      formValues.start &&
      formValues.end &&
      formValues.location &&
      formValues.month &&
      formValues.year &&
      Object.keys(errors).length === 0,
    [formValues, errors]
  );

  const selectedDays = watch('selectedDays');
  const month = watch('month');
  const year = watch('year');
  const location = watch('location');
  const start = watch('start');
  const end = watch('end');

  // Get unique locations from disponibilidades
  const availableLocations = useMemo(() => {
    const locations = new Set(disponibilidades.map((disp) => disp.location));
    return Array.from(locations).sort();
  }, [disponibilidades]);

  const handleDayToggle = (day: number) => {
    const currentDays = selectedDays || [];
    if (currentDays.includes(day)) {
      setValue(
        'selectedDays',
        currentDays.filter((d) => d !== day)
      );
    } else {
      setValue('selectedDays', [...currentDays, day]);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    setValue('month', newMonth);
    setValue('selectedDays', []);
  };

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    setValue('year', newYear);
  };

  const handleLocationChange = (newLocation: string) => {
    setSelectedLocation(newLocation);
    setValue('location', newLocation);
  };

  const formatDateTime = (dateString: string) => {
    // Extract time directly from the ISO string to avoid timezone issues
    const time = dateString.split('T')[1].substring(0, 5);
    return time;
  };

  const formatDate = (dateString: string) => {
    // Extract date directly from the ISO string to avoid timezone issues
    const date = dateString.split('T')[0];
    const [yearN, monthN, day] = date.split('-');
    return `${day}/${monthN}/${yearN}`;
  };

  const onSubmit = async (data: DisponibilidadeFormValues) => {
    try {
      isSubmitting.onTrue();

      const submissionYear = parseInt(data.year);
      const monthStart = new Date(submissionYear, parseInt(data.month), 1);
      const monthEnd = new Date(submissionYear, parseInt(data.month) + 1, 0);

      // Create availability for each selected day of the week
      for (let day = 0; day < 7; day++) {
        if (data.selectedDays.includes(day)) {
          const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const matchingDays = monthDays.filter((date) => getDay(date) === day);

          for (const date of matchingDays) {
            // Create the date string in ISO format with the exact time
            const startDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${data.start}:00`;
            const endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${data.end}:00`;

            await createDisponibilidade(treinadorId, {
              start: startDate,
              end: endDate,
              location: data.location,
              tenantId: data.tenantId,
            });
          }
        }
      }

      // Refresh the list after adding new slots
      await mutate();
      reset();
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      isSubmitting.onFalse();
    }
  };

  const handleDelete = async (disponibilidadeId: string) => {
    try {
      await deleteDisponibilidade(treinadorId, disponibilidadeId);
      // Refresh the list after deleting a slot
      await mutate();
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const filteredDisponibilidades = disponibilidades.filter((disp) => {
    const date = parseISO(disp.start);
    return (
      date.getMonth() === parseInt(selectedMonth) &&
      date.getFullYear() === parseInt(selectedYear) &&
      (!selectedLocation || disp.location === selectedLocation)
    );
  });

  // Group disponibilidades by day of week
  const disponibilidadesByDay = DAYS_OF_WEEK.map((day) => {
    const slots = filteredDisponibilidades.filter((disp) => {
      const date = parseISO(disp.start);
      return getDay(date) === day.value;
    });

    return {
      day: day.label,
      slots: slots.sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()),
    };
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Gerenciar Horários para Avaliações</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  select
                  fullWidth
                  label="Mês"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  {MONTHS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  sx={{ width: '120px' }}
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  size="small"
                >
                  {[currentYear - 1, currentYear, currentYear + 1].map((yearOption) => (
                    <MenuItem key={yearOption} value={yearOption.toString()}>
                      {yearOption}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Local da Avaliação"
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                error={!!errors.location}
                helperText={errors.location?.message}
              >
                <MenuItem value="">
                  <em>Todos os locais</em>
                </MenuItem>
                {availableLocations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="h6">Horários Disponíveis</Typography>

          {isLoading ? (
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography>Carregando disponibilidades...</Typography>
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {disponibilidadesByDay.map(({ day, slots }) => (
                <Grid item xs={12} key={day}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {day}
                      </Typography>
                      {slots.length > 0 ? (
                        <Stack spacing={1}>
                          {slots.map((slot) => (
                            <Box
                              key={slot.$id}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'background.neutral',
                                borderRadius: 1,
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="body2">{formatDate(slot.start)}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDateTime(slot.start)} - {formatDateTime(slot.end)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {slot.location}
                                </Typography>
                              </Stack>
                              <Tooltip title="Excluir horário">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(slot.$id)}
                                >
                                  <Iconify icon="mdi:delete" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum horário disponível
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Typography variant="h6" sx={{ mt: 4 }}>
            Adicionar Novos Horários
          </Typography>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selecione os dias da semana:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {DAYS_OF_WEEK.map((day) => (
                <Chip
                  key={day.value}
                  label={day.label}
                  onClick={() => handleDayToggle(day.value)}
                  color={selectedDays?.includes(day.value) ? 'primary' : 'default'}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
            {errors.selectedDays && (
              <Typography color="error" variant="caption">
                {errors.selectedDays.message}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Horário de Início"
                {...register('start')}
                error={!!errors.start}
                helperText={errors.start?.message}
              >
                {TIME_SLOTS.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Horário de Fim"
                {...register('end')}
                error={!!errors.end}
                helperText={errors.end?.message}
              >
                {TIME_SLOTS.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={availableLocations}
                value={location}
                onChange={(_, newValue) => {
                  setValue('location', newValue || '', { shouldValidate: true });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register('location')}
                    fullWidth
                    label="Local da Avaliação"
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    placeholder="Digite ou selecione um local"
                  />
                )}
              />
            </Grid>
          </Grid>

          {selectedDays?.length > 0 && start && end && location && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                O que será criado:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Horários de avaliação para cada dia selecionado no mês de{' '}
                {MONTHS[parseInt(month)]?.label}/{year}
                <br />• Horário: {start} às {end}
                <br />• Local: {location}
                <br />• Total de horários: {selectedDays.length * 4} (aproximadamente 4 semanas no
                mês)
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting.value || !isFormValid}
        >
          {isSubmitting.value ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
