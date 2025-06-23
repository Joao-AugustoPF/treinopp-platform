import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useUpdateUser } from '../hooks';
import { adaptUserToFormValues } from '../utils';
import { useListRoles } from '../../roles/hooks';

import type { IUser } from '../types/user';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = zod.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'País é obrigatório!' }), {
    message: 'País é obrigatório!',
  }),
  state: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  city: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  address: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
  zipCode: zod.string().min(1, { message: 'CEP é obrigatório!' }),
  company: zod.string().min(1, { message: 'Empresa é obrigatória!' }),
  role: zod.string().min(1, { message: 'Perfil é obrigatório!' }),
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUser;
};

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const { updateUser } = useUpdateUser();
  const { roles } = useListRoles();

  const defaultValues: UserQuickEditSchemaType = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    status: '',
    company: '',
    role: '',
  };

  const methods = useForm<UserQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
    values: adaptUserToFormValues(currentUser),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentUser) {
        await updateUser(currentUser.id, {
          name: data.name,
          email: data.email,
          roleId: data.role,
          active: data.status === 'active',
        });
      }

      toast.success('Atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro. Tente novamente.');
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Atualização rápida</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Conta aguardando confirmação
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.value === 'active'
                    ? 'Ativo'
                    : status.value === 'banned'
                      ? 'Bloqueado'
                      : status.value === 'pending'
                        ? 'Pendente'
                        : status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="name" label="Nome completo" />
            <Field.Text name="email" label="Endereço de email" />
            <Field.Phone name="phoneNumber" label="Número de telefone" />

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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Atualizar
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
