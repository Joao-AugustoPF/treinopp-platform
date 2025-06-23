'use client';

import React from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, CircularProgress } from '@mui/material';

import { useUpdateAcademia, useListUserAcademia } from 'src/features/academias/academia/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateAcademiaSchemaType = zod.infer<typeof UpdateAcademiaSchema>;

export const UpdateAcademiaSchema = zod.object({
  Id: zod.string(),
  Name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  // Email: zod
  //   .string()
  //   .min(1, { message: 'Email é obrigatório!' })
  //   .email({ message: 'Email deve ser um endereço válido!' }),
  // LogoUrl: schemaHelper.file({ message: 'Logo é obrigatória!' }),
  Phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  AddressStreet: zod.string().min(1, { message: 'Rua é obrigatória!' }),
  AddressNumber: zod.string().min(1, { message: 'Número é obrigatório!' }),
  AddressComplement: zod.string().optional(),
  AddressCity: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  AddressState: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  AddressZip: schemaHelper.cep({ message: 'CEP é obrigatório!' }),
  PaymentGateway: zod.enum(['stripe', 'mercadoPago']),
  GatewayKey: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function AccountAcademia() {
  const { academia, isLoading } = useListUserAcademia({
    search: '',
    page: 0,
    limit: 1,
    Cidade: '',
    Estado: '',
  });

  const { updateAcademia } = useUpdateAcademia();

  const academiaData = Array.isArray(academia) ? academia[0] : academia;

  const defaultValues: UpdateAcademiaSchemaType = {
    Id: academiaData?.Id || '',
    Name: academiaData?.Name || '',
    // Email: academiaData?.Email || '',
    // LogoUrl: academiaData?.LogoUrl || null,
    Phone: academiaData?.Phone || '',
    AddressStreet: academiaData?.AddressStreet || '',
    AddressNumber: academiaData?.AddressNumber || '',
    AddressCity: academiaData?.AddressCity || '',
    AddressState: academiaData?.AddressState || '',
    AddressZip: academiaData?.AddressZip || '',
    PaymentGateway: academiaData?.PaymentGateway || 'stripe',
    GatewayKey: academiaData?.GatewayKey || '',
  };

  const methods = useForm<UpdateAcademiaSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateAcademiaSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  // Reset form when data changes
  React.useEffect(() => {
    if (academiaData) {
      reset(defaultValues);
    }
  }, [academiaData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateData = {
        ...data,
        Permissions: academiaData?.Permissions || [],
        Slug: academiaData?.Slug || '',
        TenantId: academiaData?.TenantId || '',
        // LogoUrl: typeof data.LogoUrl === 'string' ? data.LogoUrl : undefined,
      };
      await updateAcademia(academiaData.Id, updateData);
      toast.success('Academia atualizada com sucesso!');
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof zod.ZodError) {
        console.error('Zod validation errors:', error.errors);
      }
      toast.error('Erro ao atualizar academia. Tente novamente.');
    }
  });

  const isOwner = academiaData?.Permissions?.includes('OWNER');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!academiaData) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>Nenhuma academia encontrada para seu perfil.</Card>
    );
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            {!isOwner && (
              <Box sx={{ mb: 2, color: 'warning.main', fontWeight: 'bold' }}>
                Você não tem permissão para editar as informações desta academia.
              </Box>
            )}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 1,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <Field.Text name="Name" label="Nome da Academia" disabled={!isOwner} />
              {/* <Field.Text name="Email" label="Email" disabled /> */}
              <Field.Phone name="Phone" label="Telefone" disabled={!isOwner} />
              <Field.Text name="AddressStreet" label="Rua" disabled={!isOwner} />
              <Field.Text name="AddressNumber" label="Número" disabled={!isOwner} />
              <Field.Text name="AddressCity" label="Cidade" disabled={!isOwner} />
              <Field.Text name="AddressState" label="Estado" disabled={!isOwner} />
              <Field.Cep name="AddressZip" label="CEP" disabled={!isOwner} />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Select name="PaymentGateway" label="Gateway de Pagamento" disabled={!isOwner}>
                <MenuItem value="stripe">Stripe</MenuItem>
                <MenuItem value="mercadoPago">Mercado Pago</MenuItem>
              </Field.Select>
              <Field.Text name="GatewayKey" label="Chave do Gateway" disabled={!isOwner} />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isOwner}
              >
                Salvar alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
