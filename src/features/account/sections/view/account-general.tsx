'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { useUpdateProfile } from '../../hooks/use-update-profile';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  Id: zod.string(),
  Name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  Email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  AvatarUrl: zod
    .union([schemaHelper.file({ message: 'Avatar inválido!' }), zod.string().nullable()])
    .optional(),
  PhoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  AddressStreet: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
  AddressNumber: zod.string().min(1, { message: 'Número é obrigatório!' }),
  AddressComplement: zod.string().optional(),
  AddressNeighborhood: zod.string().min(1, { message: 'Bairro é obrigatório!' }),
  AddressCity: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  AddressState: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  AddressZip: schemaHelper.cep({ message: 'CEP é obrigatório!' }),
  Cpf: schemaHelper.cpf({ message: 'CPF é obrigatório!' }),
  BirthDate: zod.string().min(1, { message: 'Data de nascimento é obrigatória!' }),
  // Preferences
  PrefNotifications: zod.boolean(),
  PrefEmailUpdates: zod.boolean(),
  PrefDarkMode: zod.boolean(),
  PrefOfflineMode: zod.boolean(),
  PrefHapticFeedback: zod.boolean(),
  PrefAutoUpdate: zod.boolean(),
  PrefLanguage: zod.string(),
  // Privacy
  PrivacyPublicProfile: zod.boolean(),
  PrivacyShowWorkouts: zod.boolean(),
  PrivacyShowProgress: zod.boolean(),
  PrivacyTwoFactorAuth: zod.boolean(),
  PrivacyShowClasses: zod.boolean(),
  PrivacyShowEvaluation: zod.boolean(),
  PrivacyShowNotificationIcon: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user } = useAuthContext();
  const { updateProfile } = useUpdateProfile();

  const currentUser: UpdateUserSchemaType = {
    Id: user?.profile?.$id || '',
    Name: user?.profile?.name || '',
    Email: user?.profile?.email || '',
    AvatarUrl: user?.profile?.avatarUrl || null,
    PhoneNumber: user?.profile?.phoneNumber || '',
    AddressStreet: user?.profile?.addressStreet || '',
    AddressNumber: user?.profile?.addressNumber || '',
    AddressComplement: user?.profile?.addressComplement || '',
    AddressNeighborhood: user?.profile?.addressNeighborhood || '',
    AddressCity: user?.profile?.addressCity || '',
    AddressState: user?.profile?.addressState || '',
    AddressZip: user?.profile?.addressZip || '',
    Cpf: user?.profile?.cpf || '',
    BirthDate: user?.profile?.birthDate || '',
    // Preferences
    PrefNotifications: user?.profile?.pref_notifications || true,
    PrefEmailUpdates: user?.profile?.pref_emailUpdates || true,
    PrefDarkMode: user?.profile?.pref_darkMode || false,
    PrefOfflineMode: user?.profile?.pref_offlineMode || false,
    PrefHapticFeedback: user?.profile?.pref_hapticFeedback || true,
    PrefAutoUpdate: user?.profile?.pref_autoUpdate || true,
    PrefLanguage: user?.profile?.pref_language || 'Português',
    // Privacy
    PrivacyPublicProfile: user?.profile?.privacy_publicProfile || true,
    PrivacyShowWorkouts: user?.profile?.privacy_showWorkouts || false,
    PrivacyShowProgress: user?.profile?.privacy_showProgress || true,
    PrivacyTwoFactorAuth: user?.profile?.privacy_twoFactorAuth || false,
    PrivacyShowClasses: user?.profile?.privacy_showClasses || true,
    PrivacyShowEvaluation: user?.profile?.privacy_showEvaluation || true,
    PrivacyShowNotificationIcon: user?.profile?.privacy_showNotificationIcon || true,
  };

  const defaultValues: UpdateUserSchemaType = {
    Id: '',
    Name: '',
    Email: '',
    AvatarUrl: null,
    PhoneNumber: '',
    AddressStreet: '',
    AddressNumber: '',
    AddressComplement: '',
    AddressNeighborhood: '',
    AddressCity: '',
    AddressState: '',
    AddressZip: '',
    Cpf: '',
    BirthDate: '',
    // Preferences
    PrefNotifications: true,
    PrefEmailUpdates: true,
    PrefDarkMode: false,
    PrefOfflineMode: false,
    PrefHapticFeedback: true,
    PrefAutoUpdate: true,
    PrefLanguage: 'Português',
    // Privacy
    PrivacyPublicProfile: true,
    PrivacyShowWorkouts: false,
    PrivacyShowProgress: true,
    PrivacyTwoFactorAuth: false,
    PrivacyShowClasses: true,
    PrivacyShowEvaluation: true,
    PrivacyShowNotificationIcon: true,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('[AccountGeneral] - Enviando dados para atualização:', data);
      await updateProfile(data);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('[AccountGeneral] - Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="AvatarUrl"
              maxSize={5 * 1024 * 1024} // 5MB
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Permitido: *.jpeg, *.jpg, *.png
                  <br /> Tamanho máximo: {fData(5 * 1024 * 1024)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="Name" label="Nome" />
              <Field.Text name="Email" label="Email" disabled />
              <Field.Phone name="PhoneNumber" label="Telefone" />
              <Field.Text name="AddressStreet" label="Rua" />
              <Field.Text name="AddressNumber" label="Número" />
              <Field.Text name="AddressComplement" label="Complemento" />
              <Field.Text name="AddressNeighborhood" label="Bairro" />
              <Field.Text name="AddressCity" label="Cidade" />
              <Field.Text name="AddressState" label="Estado" />
              <Field.Cep name="AddressZip" label="CEP" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Cpf name="Cpf" label="CPF" />
              <Field.DatePicker name="BirthDate" label="Data de nascimento" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Salvar alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
