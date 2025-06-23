import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import {
  Grid2,
  Typography,
  InputAdornment,
  Chip,
  Box,
  CardHeader,
  Divider,
  Alert,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import {
  useCreateMensalidade,
  useUpdateMensalidade,
  useDeleteMensalidade,
  useGenerateMensalidades,
} from '../hooks/use-mensalidades';
import { StatusMensalidade, FormaPagamento, type IMensalidade } from '../types/mensalidade';
import { type IAluno } from '../types/aluno';

interface MensalidadeControlProps {
  aluno: IAluno;
  mensalidades: IMensalidade[];
  onRefresh: VoidFunction;
}

export function MensalidadeControl({ aluno, mensalidades, onRefresh }: MensalidadeControlProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMensalidade, setSelectedMensalidade] = useState<IMensalidade | null>(null);
  const [mensalidadeToDelete, setMensalidadeToDelete] = useState<IMensalidade | null>(null);

  const { createMensalidade } = useCreateMensalidade();
  const { updateMensalidade } = useUpdateMensalidade();
  const { deleteMensalidade } = useDeleteMensalidade();
  const { generateMensalidades } = useGenerateMensalidades();

  const handleOpenDialog = (mensalidade?: IMensalidade) => {
    setSelectedMensalidade(mensalidade || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedMensalidade(null);
    setOpenDialog(false);
  };

  const handleMarkAsPaid = async (mensalidade: IMensalidade) => {
    try {
      await updateMensalidade(mensalidade.Id, {
        Status: StatusMensalidade.PAGO,
        DataPagamento: new Date().toISOString(),
        AlunoId: aluno.Id,
      });
      toast.success('Mensalidade marcada como paga!');
      onRefresh();
    } catch (error) {
      toast.error('Erro ao atualizar mensalidade');
    }
  };

  const handleOpenDeleteDialog = (mensalidade: IMensalidade) => {
    setMensalidadeToDelete(mensalidade);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setMensalidadeToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (!mensalidadeToDelete) return;

    try {
      await deleteMensalidade(mensalidadeToDelete.Id, aluno.Id);
      toast.success('Mensalidade deletada com sucesso!');
      handleCloseDeleteDialog();
      onRefresh();
    } catch (error) {
      toast.error('Erro ao deletar mensalidade');
    }
  };

  const handleGenerateMensalidades = async (meses: number) => {
    try {
      await generateMensalidades(aluno.Id, meses);
      toast.success(`${meses} mensalidade(s) gerada(s) com sucesso!`);
      setOpenGenerateDialog(false);
      onRefresh();
    } catch (error) {
      toast.error('Erro ao gerar mensalidades');
    }
  };

  const getStatusColor = (status: StatusMensalidade) => {
    switch (status) {
      case StatusMensalidade.PAGO:
        return 'success';
      case StatusMensalidade.ATRASADO:
        return 'error';
      case StatusMensalidade.PENDENTE:
        return 'warning';
      case StatusMensalidade.CANCELADO:
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatMonthYear = (mesReferencia: string) => {
    const [year, month] = mesReferencia.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const checkIfOverdue = (mensalidade: IMensalidade) => {
    if (mensalidade.Status === StatusMensalidade.PAGO) return false;
    const today = new Date();
    const vencimento = new Date(mensalidade.DataVencimento);
    return today > vencimento;
  };

  // Calcular estatísticas
  const totalMensalidades = mensalidades.length;
  const mensalidadesPagas = mensalidades.filter((m) => m.Status === StatusMensalidade.PAGO).length;
  const mensalidadesPendentes = mensalidades.filter(
    (m) => m.Status === StatusMensalidade.PENDENTE
  ).length;
  const mensalidadesAtrasadas = mensalidades.filter((m) => checkIfOverdue(m)).length;

  return (
    <Card>
      <CardHeader
        title="Controle de Mensalidades"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:calendar-add-bold" />}
              onClick={() => setOpenGenerateDialog(true)}
            >
              Gerar Mensalidades
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:add-bold" />}
              onClick={() => handleOpenDialog()}
            >
              Nova Mensalidade
            </Button>
          </Stack>
        }
      />

      {/* <Divider /> */}

      {/* Estatísticas */}
      <Stack direction="row" spacing={2} sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" color="primary.main">
            {totalMensalidades}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" color="success.main">
            {mensalidadesPagas}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pagas
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" color="warning.main">
            {mensalidadesPendentes}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pendentes
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h4" color="error.main">
            {mensalidadesAtrasadas}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Atrasadas
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {mensalidadesAtrasadas > 0 && (
        <Alert severity="warning" sx={{ m: 3 }}>
          Este aluno possui {mensalidadesAtrasadas} mensalidade(s) em atraso.
        </Alert>
      )}

      <Stack spacing={2} sx={{ p: 3 }}>
        {mensalidades.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            Nenhuma mensalidade cadastrada
          </Typography>
        ) : (
          mensalidades.map((mensalidade) => (
            <Box
              key={mensalidade.Id}
              sx={{
                p: 2,
                border: 1,
                borderColor: checkIfOverdue(mensalidade) ? 'error.main' : 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: checkIfOverdue(mensalidade) ? 'error.lighter' : 'background.paper',
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">
                  {formatMonthYear(mensalidade.MesReferencia)} - {formatCurrency(mensalidade.Valor)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vencimento: {formatDate(mensalidade.DataVencimento)}
                </Typography>
                {mensalidade.DataPagamento && (
                  <Typography variant="caption" color="success.main">
                    Pago em: {formatDate(mensalidade.DataPagamento)}
                  </Typography>
                )}
                {mensalidade.FormaPagamento && (
                  <Typography variant="caption" color="text.secondary">
                    Forma: {mensalidade.FormaPagamento}
                  </Typography>
                )}
                {mensalidade.Observacoes && (
                  <Typography variant="caption" color="text.secondary">
                    Obs: {mensalidade.Observacoes}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={mensalidade.Status}
                  color={getStatusColor(mensalidade.Status)}
                  size="small"
                />

                {mensalidade.Status === StatusMensalidade.PENDENTE && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleMarkAsPaid(mensalidade)}
                  >
                    Marcar como Pago
                  </Button>
                )}

                <Button size="small" onClick={() => handleOpenDialog(mensalidade)}>
                  Editar
                </Button>

                <Button size="small" color="error" onClick={() => handleOpenDeleteDialog(mensalidade)}>
                  Deletar
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Stack>

      <MensalidadeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        mensalidade={selectedMensalidade}
        aluno={aluno}
        onSuccess={() => {
          handleCloseDialog();
          onRefresh();
        }}
      />

      <GenerateMensalidadesDialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        onGenerate={handleGenerateMensalidades}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        mensalidade={mensalidadeToDelete}
      />
    </Card>
  );
}

// Tipos para o formulário
interface MensalidadeFormData {
  MesReferencia: string;
  DataVencimento: string;
  Valor: number;
  Status: StatusMensalidade;
  FormaPagamento: FormaPagamento | '';
  Observacoes: string;
  DataPagamento?: string;
}

// Componente do Dialog para criar/editar mensalidade
interface MensalidadeDialogProps {
  open: boolean;
  onClose: VoidFunction;
  mensalidade?: IMensalidade | null;
  aluno: IAluno;
  onSuccess: VoidFunction;
}

function MensalidadeDialog({
  open,
  onClose,
  mensalidade,
  aluno,
  onSuccess,
}: MensalidadeDialogProps) {
  const { createMensalidade } = useCreateMensalidade();
  const { updateMensalidade } = useUpdateMensalidade();

  const isEditing = !!mensalidade;

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const defaultValues: MensalidadeFormData = {
    MesReferencia: mensalidade?.MesReferencia || getCurrentYearMonth(),
    DataVencimento: formatDateForInput(mensalidade?.DataVencimento) || '',
    Valor: mensalidade?.Valor || aluno.Plano.Valor,
    Status: mensalidade?.Status || StatusMensalidade.PENDENTE,
    FormaPagamento: mensalidade?.FormaPagamento || '',
    Observacoes: mensalidade?.Observacoes || '',
    DataPagamento: formatDateForInput(mensalidade?.DataPagamento) || '',
  };

  const methods = useForm<MensalidadeFormData>({
    defaultValues,
    values: isEditing ? {
      MesReferencia: mensalidade?.MesReferencia || getCurrentYearMonth(),
      DataVencimento: formatDateForInput(mensalidade?.DataVencimento) || '',
      Valor: mensalidade?.Valor || aluno.Plano.Valor,
      Status: mensalidade?.Status || StatusMensalidade.PENDENTE,
      FormaPagamento: mensalidade?.FormaPagamento || '',
      Observacoes: mensalidade?.Observacoes || '',
      DataPagamento: formatDateForInput(mensalidade?.DataPagamento) || '',
    } : defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const statusValue = watch('Status');

  // Gerar opções de mês/ano (últimos 12 meses + próximos 12 meses)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    // Gerar de 12 meses atrás até 12 meses no futuro
    for (let i = -12; i <= 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const value = `${year}-${month}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();

  const onSubmit = handleSubmit(async (data: MensalidadeFormData) => {
    try {
      const formattedData = {
        ...data,
        // Converter datas para ISO string se fornecidas
        DataVencimento: data.DataVencimento ? new Date(data.DataVencimento).toISOString() : '',
        DataPagamento: data.DataPagamento ? new Date(data.DataPagamento).toISOString() : undefined,
        // Garantir que FormaPagamento seja do tipo correto ou undefined
        FormaPagamento: data.FormaPagamento || undefined,
      };

      if (isEditing && mensalidade) {
        await updateMensalidade(mensalidade.Id, {
          ...formattedData,
          AlunoId: aluno.Id,
        });
        toast.success('Mensalidade atualizada com sucesso!');
      } else {
        await createMensalidade({
          AlunoId: aluno.Id,
          PlanoId: aluno.Plano.Id,
          ...formattedData,
        });
        toast.success('Mensalidade criada com sucesso!');
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar mensalidade:', error);
      toast.error('Erro ao salvar mensalidade');
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Mensalidade' : 'Nova Mensalidade'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Mês de Referência</InputLabel>
              <Select
                value={watch('MesReferencia')}
                onChange={(e) => setValue('MesReferencia', e.target.value)}
                label="Mês de Referência"
                disabled={isEditing} // Não permitir editar o mês de referência
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="solar:calendar-bold" />
                  </InputAdornment>
                }
              >
                {monthOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Field.Text
              name="DataVencimento"
              label="Data de Vencimento"
              type="date"
              InputLabelProps={{ shrink: true }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:calendar-mark-bold" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Field.Text
              name="Valor"
              label="Valor"
              type="number"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:dollar-minimalistic-bold" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Field.Select name="Status" label="Status">
              {Object.values(StatusMensalidade).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Field.Select>

            {statusValue === StatusMensalidade.PAGO && (
              <Field.Text
                name="DataPagamento"
                label="Data do Pagamento"
                type="date"
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:check-circle-bold" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}

            <Field.Select name="FormaPagamento" label="Forma de Pagamento">
              <MenuItem value="">Selecione...</MenuItem>
              {Object.values(FormaPagamento).map((forma) => (
                <MenuItem key={forma} value={forma}>
                  {forma.replace('_', ' ')}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="Observacoes" label="Observações" multiline rows={3} />
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
            startIcon={<Iconify icon={isEditing ? 'solar:check-bold' : 'solar:add-bold'} />}
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

// Dialog para gerar mensalidades automaticamente
interface GenerateMensalidadesDialogProps {
  open: boolean;
  onClose: VoidFunction;
  onGenerate: (meses: number) => void;
}

function GenerateMensalidadesDialog({ open, onClose, onGenerate }: GenerateMensalidadesDialogProps) {
  const [meses, setMeses] = useState(6);

  const handleGenerate = () => {
    onGenerate(meses);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Gerar Mensalidades</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Quantas mensalidades você deseja gerar automaticamente?
          </Typography>

          <TextField
            label="Número de meses"
            type="number"
            value={meses}
            onChange={(e) => setMeses(Number(e.target.value))}
            inputProps={{ min: 1, max: 12 }}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleGenerate}>
          Gerar {meses} Mensalidade{meses > 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Dialog de confirmação para deletar mensalidade
interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
  mensalidade: IMensalidade | null;
}

function DeleteConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  mensalidade 
}: DeleteConfirmationDialogProps) {
  const formatMonthYear = (mesReferencia: string) => {
    const [year, month] = mesReferencia.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:danger-bold" sx={{ color: 'error.main' }} />
          <Typography variant="h6">Confirmar Exclusão</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            Tem certeza que deseja deletar esta mensalidade?
          </Typography>
          
          {mensalidade && (
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {formatMonthYear(mensalidade.MesReferencia)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valor: {formatCurrency(mensalidade.Valor)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {mensalidade.Status}
              </Typography>
            </Box>
          )}

          <Alert severity="warning">
            Esta ação não pode ser desfeita!
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={onConfirm}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
} 