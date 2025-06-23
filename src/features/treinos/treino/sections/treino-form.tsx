'use client';

import type { useBoolean } from 'minimal-shared/hooks';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useCreateTreino, useUpdateTreino } from '../hooks';
import { useTreinoListViewStore } from '../stores/treino-list-view.store';

import type { IExercicio, TipoTreino } from '../types';

type Props = {
  dialog: ReturnType<typeof useBoolean>;
};

export type ITreinoFormValues = {
  Nome: string;
  TipoTreino: string;
  AlunoId: string;
  Exercicios: IExercicio[];
};

const TIPO_TREINO_OPTIONS = [
  { value: 'Força', label: 'Força' },
  { value: 'Cardio', label: 'Cardio' },
  { value: 'Flexibilidade', label: 'Flexibilidade' },
  { value: 'HIIT', label: 'HIIT' },
];

export function TreinoForm({ dialog }: Props) {
  const { currentTreino, setCurrentTreino } = useTreinoListViewStore();
  const { createTreino, isLoading: isCreating } = useCreateTreino();
  const { updateTreino, isLoading: isUpdating } = useUpdateTreino();

  const [formData, setFormData] = useState({
    Nome: '',
    TipoTreino: '',
    AlunoId: '',
    Exercicios: [] as IExercicio[],
  });

  const isLoading = isCreating || isUpdating;
  const isEdit = !!currentTreino;

  useEffect(() => {
    if (currentTreino) {
      setFormData({
        Nome: currentTreino.Nome,
        TipoTreino: currentTreino.TipoTreino,
        AlunoId: currentTreino.AlunoId,
        Exercicios: currentTreino.Exercicios,
      });
    } else {
      setFormData({
        Nome: '',
        TipoTreino: '',
        AlunoId: '',
        Exercicios: [],
      });
    }
  }, [currentTreino]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setCurrentTreino(null);
    dialog.onFalse();
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && currentTreino) {
        await updateTreino(currentTreino.Id, {
          ...formData,
          TipoTreino: formData.TipoTreino as TipoTreino,
        });
      } else {
        await createTreino({
          ...formData,
          TipoTreino: formData.TipoTreino as TipoTreino,
          TreinadorId: '',
          CreatedBy: '',
          UpdatedBy: '',
          IsDeleted: false,
        });
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={dialog.value} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Editar Treino' : 'Novo Treino'}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Tipo de Treino"
              name="TipoTreino"
              value={formData.TipoTreino}
              onChange={handleChange}
            >
              {TIPO_TREINO_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ID do Aluno"
              name="AlunoId"
              value={formData.AlunoId}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          Cancelar
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
