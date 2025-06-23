import { z, z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { PoliciesSelect } from './policies-select';
import { useCreateRole } from '../hooks/use-create-role';
import { useUpdateRole } from '../hooks/use-update-role';

import type { IRole } from '../types';

// ----------------------------------------------------------------------

export type RoleCreateSchemaType = zod.infer<typeof RoleCreateSchema>;

export const RoleCreateSchema = zod.object({
  name: zod.string().min(1, { message: 'Por favor, insira um nome para o perfil!' }),
  policies: zod
    .array(
      zod.object({
        id: zod.string(),
        name: zod.string(),
        permissions: zod.array(
          z.object({
            id: z.string(),
            name: z.string(),
            action: z.string(),
            subject: z.string(),
          })
        ),
      })
    )
    .min(1, { message: 'Por favor, selecione pelo menos uma permissão!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentRole?: IRole;
};

const defaultValues: RoleCreateSchemaType = {
  name: '',
  policies: [],
};

export function RoleForm({ currentRole, open, onClose }: Props) {
  const isEdit = !!currentRole;

  const { createRole } = useCreateRole();
  const { updateRole } = useUpdateRole();

  const methods = useForm<RoleCreateSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoleCreateSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEdit && currentRole?.id) {
        await toast
          .promise(updateRole(currentRole.id, data), {
            loading: 'Atualizando perfil...',
            success: 'Perfil atualizado com sucesso!',
            error: 'Erro ao atualizar perfil',
          })
          .unwrap();
      } else {
        await toast
          .promise(createRole(data), {
            loading: 'Criando perfil...',
            success: 'Perfil criado com sucesso!',
            error: 'Erro ao criar perfil',
          })
          .unwrap();
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    onClose();
    reset(defaultValues);
  };

  useEffect(() => {
    if (currentRole) reset(currentRole);
  }, [currentRole, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle sx={{ pb: 0 }}>{isEdit ? 'Editar perfil' : 'Criar perfil'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ p: 0 }}>
          <Stack spacing={2} width="100%" p={3}>
            <Field.Text name="name" label="Nome do perfil" />
            <PoliciesSelect />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pt: 0 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? 'Atualizar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
