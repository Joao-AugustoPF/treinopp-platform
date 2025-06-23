import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Grid2, Typography, InputAdornment } from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useCreateNotificacao, useUpdateNotificacao } from '../hooks';
import { NotificacaoTipo, type INotificacao } from '../types/notificacao';

// Schema de validação
import { z } from 'zod';

const NotificacaoSchema = z.object({
  Titulo: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(128, 'Título deve ter no máximo 128 caracteres'),
  Mensagem: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(512, 'Mensagem deve ter no máximo 512 caracteres'),
  Tipo: z.nativeEnum(NotificacaoTipo),
});

type NotificacaoSchemaType = z.infer<typeof NotificacaoSchema>;

interface NotificacaoFormProps {
  open: boolean;
  onClose: VoidFunction;
  currentNotificacao?: INotificacao | null;
}

export function NotificacaoForm({ open, onClose, currentNotificacao }: NotificacaoFormProps) {
  const { createNotificacao } = useCreateNotificacao();
  const { updateNotificacao } = useUpdateNotificacao();

  const defaultValues: NotificacaoSchemaType = {
    Titulo: '',
    Mensagem: '',
    Tipo: NotificacaoTipo.INFO,
  };

  const methods = useForm<NotificacaoSchemaType>({
    resolver: zodResolver(NotificacaoSchema),
    defaultValues,
    values: currentNotificacao ? adaptNotificacaoToForm(currentNotificacao) : defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const selectedTipo = watch('Tipo');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentNotificacao?.Id) {
        await updateNotificacao(currentNotificacao.Id, data);
        toast.success('Notificação atualizada com sucesso!');
      } else {
        await createNotificacao(data);
        toast.success('Notificação criada com sucesso!');
      }

      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{currentNotificacao ? 'Editar Notificação' : 'Nova Notificação'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid2 container spacing={3} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12 }}>
              <Stack spacing={3}>
                <Field.Text
                  name="Titulo"
                  label="Título"
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:notification-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Field.Text
                  name="Mensagem"
                  label="Mensagem"
                  multiline
                  rows={4}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:chat-round-dots-bold" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Field.Select
                  name="Tipo"
                  label="Tipo"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify
                            icon={
                              selectedTipo === NotificacaoTipo.INFO
                                ? 'solar:info-circle-bold'
                                : selectedTipo === NotificacaoTipo.SUCCESS
                                  ? 'solar:check-circle-bold'
                                  : selectedTipo === NotificacaoTipo.WARNING
                                    ? 'solar:warning-circle-bold'
                                    : 'solar:error-circle-bold'
                            }
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                >
                  <MenuItem value={NotificacaoTipo.INFO}>Informação</MenuItem>
                  <MenuItem value={NotificacaoTipo.SUCCESS}>Sucesso</MenuItem>
                  <MenuItem value={NotificacaoTipo.WARNING}>Aviso</MenuItem>
                  <MenuItem value={NotificacaoTipo.ERROR}>Erro</MenuItem>
                </Field.Select>
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
          startIcon={<Iconify icon={currentNotificacao ? 'solar:check-bold' : 'solar:add-bold'} />}
        >
          {currentNotificacao ? 'Salvar' : 'Criar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function adaptNotificacaoToForm(notificacao: INotificacao): NotificacaoSchemaType {
  return {
    Titulo: notificacao.Titulo,
    Mensagem: notificacao.Mensagem,
    Tipo: notificacao.Tipo,
  };
}
