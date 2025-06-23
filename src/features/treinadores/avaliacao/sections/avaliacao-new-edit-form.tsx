import { z } from 'zod';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';

import { StatusAvaliacao } from '../types';
import { useUpdateAvaliacao } from '../hooks/use-update-avaliacao';

import type { IAvaliacao, AvaliacaoCreateSchemaType } from '../types';
import { toast } from 'src/components/snackbar';

const statusTranslation: Record<StatusAvaliacao, string> = {
  [StatusAvaliacao.AGENDADA]: 'Agendada',
  [StatusAvaliacao.CANCELADA]: 'Cancelada',
  [StatusAvaliacao.REALIZADA]: 'Realizada',
};

const AvaliacaoSchema = z.object({
  Status: z.nativeEnum(StatusAvaliacao),
  DataCheckIn: z.string().optional(),
  TenantId: z.string(),
  PerfilMembroId: z.object({
    Id: z.string(),
    UserId: z.string(),
    Nome: z.string(),
    Email: z.string(),
    Role: z.string(),
    TenantId: z.string(),
    Status: z.string(),
  }),
  SlotAvaliacaoId: z.object({
    Id: z.string(),
    TenantId: z.string(),
    DataInicio: z.string(),
    DataFim: z.string(),
    Local: z.string(),
    PerfilTreinadorId: z.object({
      Id: z.string(),
      UserId: z.string(),
      Nome: z.string(),
      Email: z.string(),
      Role: z.string(),
      TenantId: z.string(),
      Status: z.string(),
    }),
  }),
  Observacoes: z.string().optional(),
  Objetivos: z.array(z.string()).optional(),
  Restricoes: z.array(z.string()).optional(),
  HistoricoMedico: z.string().optional(),
  Medidas: z
    .object({
      weight: z.number().optional(),
      body_fat_pct: z.number().optional(),
      lean_mass_pct: z.number().optional(),
      bmi: z.number().optional(),
      muscle_mass: z.number().optional(),
      bone_mass: z.number().optional(),
      body_water_pct: z.number().optional(),
      bmr: z.number().optional(),
      metabolic_age: z.number().optional(),
      visceral_fat: z.number().optional(),
      waist_circ: z.number().optional(),
      hip_circ: z.number().optional(),
      wh_ratio: z.number().optional(),
      chest_circ: z.number().optional(),
      arm_circ: z.number().optional(),
      thigh_circ: z.number().optional(),
      calf_circ: z.number().optional(),
      rest_hr: z.number().optional(),
      bp_systolic: z.number().optional(),
      bp_diastolic: z.number().optional(),
      vo2max: z.number().optional(),
      height: z.number().optional(),
      body_temp: z.number().optional(),
    })
    .optional(),
});

type AvaliacaoFormValues = z.infer<typeof AvaliacaoSchema>;

type Props = {
  currentAvaliacao: IAvaliacao;
  metrics: Record<string, number>;
  treinadorId: string;
  onSuccess?: () => void;
};

const calculateBMI = (weight: number, height: number) => {
  // height in cm to m
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const calculateWHRatio = (waist: number, hip: number) => waist / hip;

const adaptApiToForm = (
  apiData: any,
  metricsData: Record<string, number> = {}
): AvaliacaoFormValues => ({
  Status: apiData.Status || StatusAvaliacao.AGENDADA,
  DataCheckIn: apiData.DataCheckIn || '',
  TenantId: apiData.TenantId || '',
  PerfilMembroId: {
    Id: apiData.PerfilMembroId?.$id || '',
    UserId: apiData.PerfilMembroId?.userId || '',
    Nome: apiData.PerfilMembroId?.name || '',
    Email: apiData.PerfilMembroId?.email || '',
    Role: apiData.PerfilMembroId?.role || '',
    TenantId: apiData.PerfilMembroId?.tenantId || '',
    Status: apiData.PerfilMembroId?.status || '',
  },
  SlotAvaliacaoId: {
    Id: apiData.SlotAvaliacaoId?.$id || '',
    TenantId: apiData.SlotAvaliacaoId?.tenantId || '',
    DataInicio: apiData.SlotAvaliacaoId?.start || '',
    DataFim: apiData.SlotAvaliacaoId?.end || '',
    Local: apiData.SlotAvaliacaoId?.location || '',
    PerfilTreinadorId: {
      Id: apiData.SlotAvaliacaoId?.trainerProfileId?.$id || '',
      UserId: apiData.SlotAvaliacaoId?.trainerProfileId?.userId || '',
      Nome: apiData.SlotAvaliacaoId?.trainerProfileId?.name || '',
      Email: apiData.SlotAvaliacaoId?.trainerProfileId?.email || '',
      Role: apiData.SlotAvaliacaoId?.trainerProfileId?.role || '',
      TenantId: apiData.SlotAvaliacaoId?.trainerProfileId?.tenantId || '',
      Status: apiData.SlotAvaliacaoId?.trainerProfileId?.status || '',
    },
  },
  Observacoes: apiData.Observacoes || '',
  Objetivos: apiData.Objetivos || [],
  Restricoes: apiData.Restricoes || [],
  HistoricoMedico: apiData.HistoricoMedico || '',
  Medidas: {
    ...metricsData,
    ...(typeof (apiData as any).Medidas === 'object' ? (apiData as any).Medidas : {}),
  },
});

export function AvaliacaoNewEditForm({ currentAvaliacao, metrics, treinadorId, onSuccess }: Props) {
  const { updateAvaliacao } = useUpdateAvaliacao(treinadorId);

  console.log('currentMetrics: ', metrics);
  const defaultValues: AvaliacaoFormValues = adaptApiToForm(currentAvaliacao, metrics);

  const methods = useForm<AvaliacaoFormValues>({
    resolver: zodResolver(AvaliacaoSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const currentStatus = watch('Status');
  const weight = watch('Medidas.weight');
  const height = watch('Medidas.height');
  const waist = watch('Medidas.waist_circ');
  const hip = watch('Medidas.hip_circ');

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const bmi = calculateBMI(weight, height);
      setValue('Medidas.bmi', Number(bmi.toFixed(2)));
    }
  }, [weight, height, setValue]);

  // Calculate WH Ratio when waist or hip changes
  useEffect(() => {
    if (waist && hip) {
      const whRatio = calculateWHRatio(waist, hip);
      setValue('Medidas.wh_ratio', Number(whRatio.toFixed(2)));
    }
  }, [waist, hip, setValue]);

  useEffect(() => {
    if (currentAvaliacao) {
      reset(defaultValues);
    }
  }, [currentAvaliacao, reset]);

  // Log validation errors when they occur
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error('Zod validation errors:', errors);
    }
  }, [errors]);

  const onSubmit = handleSubmit(async (data) => {
    console.log('Zod validation successful, submitting data:', data);

    if (currentAvaliacao) {
      await updateAvaliacao(currentAvaliacao.Id, data as AvaliacaoCreateSchemaType);
      toast.success('Avaliação atualizada com sucesso');
    }
    if (onSuccess) onSuccess();
  });

  // Renderização dinâmica para Objetivos e Restrições
  const objetivosArray = useFieldArray({ control, name: 'Objetivos' as never });
  const restricoesArray = useFieldArray({ control, name: 'Restricoes' as never });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {/* Status e Check-in */}
        <Card>
          <CardHeader title="Status da Avaliação" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Select name="Status" label="Status">
              {Object.values(StatusAvaliacao).map((status) => (
                <MenuItem key={status} value={status}>
                  {statusTranslation[status]}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.MobileDateTimePicker
              format="DD/MM/YYYY - HH:mm"
              name="DataCheckIn"
              label="Data e Hora do Check-in"
            />
          </Stack>
        </Card>

        {/* Informações do Membro */}
        <Card>
          <CardHeader title="Informações do Membro" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="PerfilMembroId.Nome" label="Nome do Membro" disabled />
            <Field.Text name="PerfilMembroId.Email" label="Email do Membro" disabled />
          </Stack>
        </Card>

        {/* Informações do Slot */}
        <Card>
          <CardHeader title="Informações do Horário" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="SlotAvaliacaoId.Local" label="Local" disabled />
            <Field.DatePicker
              format="DD/MM/YYYY - HH:mm"
              name="SlotAvaliacaoId.DataInicio"
              label="Data de Início"
              disabled
            />
            <Field.DatePicker
              format="DD/MM/YYYY - HH:mm"
              name="SlotAvaliacaoId.DataFim"
              label="Data de Término"
              disabled
            />
          </Stack>
        </Card>

        {/* Métricas Corporais */}
        {currentStatus === StatusAvaliacao.REALIZADA && (
          <Card>
            <CardHeader title="Métricas Corporais" />
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Medidas Básicas
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.weight" label="Peso (kg)" />
                <Field.Text type="number" name="Medidas.height" label="Altura (cm)" />
                <Field.Text type="number" name="Medidas.bmi" label="IMC" disabled />
              </Stack>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Composição Corporal
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.body_fat_pct" label="Gordura (%)" />
                <Field.Text type="number" name="Medidas.lean_mass_pct" label="Massa Magra (%)" />
                <Field.Text type="number" name="Medidas.muscle_mass" label="Massa Muscular (kg)" />
                <Field.Text type="number" name="Medidas.bone_mass" label="Massa Óssea (kg)" />
              </Stack>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Medidas de Circunferência
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.waist_circ" label="Cintura (cm)" />
                <Field.Text type="number" name="Medidas.hip_circ" label="Quadril (cm)" />
                <Field.Text type="number" name="Medidas.wh_ratio" label="Relação C/Q" disabled />
                <Field.Text type="number" name="Medidas.chest_circ" label="Peito (cm)" />
                <Field.Text type="number" name="Medidas.arm_circ" label="Braço (cm)" />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.thigh_circ" label="Coxa (cm)" />
                <Field.Text type="number" name="Medidas.calf_circ" label="Panturrilha (cm)" />
              </Stack>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Saúde e Metabolismo
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.body_water_pct" label="Água (%)" />
                <Field.Text type="number" name="Medidas.bmr" label="TMB" />
                <Field.Text type="number" name="Medidas.metabolic_age" label="Idade Metabólica" />
                <Field.Text type="number" name="Medidas.visceral_fat" label="Gordura Visceral" />
              </Stack>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Vitalidade
              </Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text type="number" name="Medidas.rest_hr" label="FC Repouso" />
                <Field.Text type="number" name="Medidas.bp_systolic" label="Pressão Sistólica" />
                <Field.Text type="number" name="Medidas.bp_diastolic" label="Pressão Diastólica" />
                <Field.Text type="number" name="Medidas.vo2max" label="VO2 Máximo" />
                <Field.Text type="number" name="Medidas.body_temp" label="Temperatura (°C)" />
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Observações e Anotações */}
        <Card>
          <CardHeader title="Observações e Anotações" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="Observacoes" label="Observações" multiline rows={4} />
            <Typography variant="subtitle2">Objetivos</Typography>
            <Stack spacing={1}>
              {objetivosArray.fields.map((field, idx) => (
                <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Field.Text name={`Objetivos.${idx}`} label={`Objetivo ${idx + 1}`} fullWidth />
                  <LoadingButton
                    color="error"
                    onClick={() => objetivosArray.remove(idx)}
                    disabled={objetivosArray.fields.length === 1}
                  >
                    Remover
                  </LoadingButton>
                </Box>
              ))}
              <LoadingButton onClick={() => objetivosArray.append('')}>
                Adicionar Objetivo
              </LoadingButton>
            </Stack>
            <Typography variant="subtitle2">Restrições</Typography>
            <Stack spacing={1}>
              {restricoesArray.fields.map((field, idx) => (
                <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Field.Text name={`Restricoes.${idx}`} label={`Restrição ${idx + 1}`} fullWidth />
                  <LoadingButton
                    color="error"
                    onClick={() => restricoesArray.remove(idx)}
                    disabled={restricoesArray.fields.length === 1}
                  >
                    Remover
                  </LoadingButton>
                </Box>
              ))}
              <LoadingButton onClick={() => restricoesArray.append('')}>
                Adicionar Restrição
              </LoadingButton>
            </Stack>
            <Field.Text name="HistoricoMedico" label="Histórico Médico" multiline rows={4} />
          </Stack>
        </Card>

        {/* Botão de Submit */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentAvaliacao ? 'Salvar alterações' : 'Criar avaliação'}
          </LoadingButton>
        </Box>
      </Stack>
    </Form>
  );
}
