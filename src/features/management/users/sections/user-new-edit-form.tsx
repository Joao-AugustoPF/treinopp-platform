import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { adaptUserToFormValues } from '../utils';
import { useListRoles } from '../../roles/hooks';
import { useCreateUser, useUpdateUser } from '../hooks';

import type { IUser } from '../types/user';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({ message: 'Avatar é obrigatório!' }).optional(),
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'País é obrigatório!' }), {
    message: 'País é obrigatório!',
  }),
  address: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
  company: zod.string().min(1, { message: 'Empresa é obrigatória!' }),
  state: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  city: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  role: zod.string().min(1, { message: 'Perfil é obrigatório!' }),
  zipCode: zod.string().min(1, { message: 'CEP é obrigatório!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();
  const { roles } = useListRoles();

  const defaultValues: NewUserSchemaType = {
    status: '',
    avatarUrl: null,
    isVerified: true,
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    company: '',
    role: '',
  };

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
    values: adaptUserToFormValues(currentUser),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser) {
        await updateUser(currentUser.id, {
          name: data.name,
          email: data.email,
          roleId: data.role,
          active: data.status === 'active',
        });
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await createUser({
          name: data.name,
          email: data.email,
          roleId: data.role,
          password: 'senha123',
          confirmPassword: 'senha123',
        });
        toast.success('Usuário criado com sucesso!');
      }
      router.push(paths.account.root);
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro. Tente novamente.');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 'active'
                  ? 'Ativo'
                  : values.status === 'banned'
                    ? 'Bloqueado'
                    : 'Pendente'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
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
                    Permitido *.jpeg, *.jpg, *.png, *.gif
                    <br /> tamanho máximo de {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Bloqueado
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Aplicar desativação da conta
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verificado
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Desativar isso enviará automaticamente um email de verificação para o usuário
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  Excluir usuário
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Nome completo" />
              <Field.Text name="email" label="Endereço de email" />
              <Field.Phone
                name="phoneNumber"
                label="Número de telefone"
                country={!currentUser ? 'BR' : undefined}
              />

              <Field.CountrySelect
                fullWidth
                name="country"
                label="País"
                placeholder="Escolha um país"
              />

              <Field.Text name="state" label="Estado" />
              <Field.Text name="city" label="Cidade" />
              <Field.Text name="address" label="Endereço" />
              <Field.Text name="zipCode" label="CEP" />
              <Field.Text name="company" label="Empresa" />

              <Field.Select name="role" label="Perfil">
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Criar usuário' : 'Salvar alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
