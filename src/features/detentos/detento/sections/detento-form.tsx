import type { UseBooleanReturn } from 'minimal-shared/hooks';

import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { Stack, MenuItem } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Form, Field } from 'src/components/hook-form';

import { useCreateDetento, useUpdateDetento } from '../hooks';
import { useDetentoListViewStore } from '../stores/detento-list-view.store';
import { Cor, Cela, Sexo, Boca, Rosto, Nariz, Dentes, Galeria, Cabelos, CorOlhos } from '../types';

const schema = z.object({
  Nome: z.string().min(1, 'Nome é obrigatório'),
  FotoPerfil: z.string().nullable(),
  Fotos: z.array(z.string()).default([]),
  Galeria: z.nativeEnum(Galeria, { required_error: 'Galeria é obrigatória' }),
  Cela: z.nativeEnum(Cela, { required_error: 'Cela é obrigatória' }),
  CID: z.string().min(1, 'CID é obrigatório'),
  Sexo: z.nativeEnum(Sexo, { required_error: 'Sexo é obrigatório' }),
  DataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  Telefone: z.string().min(1, 'Telefone é obrigatório'),
  Cor: z.nativeEnum(Cor, { required_error: 'Cor é obrigatória' }),
  Rosto: z.nativeEnum(Rosto, { required_error: 'Rosto é obrigatório' }),
  CorOlhos: z.nativeEnum(CorOlhos, { required_error: 'Cor dos olhos é obrigatória' }),
  Nariz: z.nativeEnum(Nariz, { required_error: 'Nariz é obrigatório' }),
  Boca: z.nativeEnum(Boca, { required_error: 'Boca é obrigatória' }),
  Dentes: z.nativeEnum(Dentes, { required_error: 'Dentes é obrigatório' }),
  Cabelos: z.nativeEnum(Cabelos, { required_error: 'Cabelos é obrigatório' }),
  Altura: z.string().min(1, 'Altura é obrigatória'),
  SinaisParticulares: z.string().nullable(),
  TatuagensQuantidade: z.string().nullable(),
  TatuagensLocalizacao: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  dialog: UseBooleanReturn;
};

const defaultValues: FormValues = {
  Nome: '',
  FotoPerfil: '',
  Fotos: [],
  Galeria: Galeria.A,
  Cela: Cela.UM,
  CID: '',
  Sexo: Sexo.MASCULINO,
  DataNascimento: '',
  Telefone: '',
  Cor: Cor.BRANCO,
  Rosto: Rosto.REDONDO,
  CorOlhos: CorOlhos.CASTANHO,
  Nariz: Nariz.MEDIO,
  Boca: Boca.MEDIA,
  Dentes: Dentes.BOM,
  Cabelos: Cabelos.LISO,
  Altura: '',
  SinaisParticulares: '',
  TatuagensQuantidade: '',
  TatuagensLocalizacao: '',
};

export function DetentoForm({ dialog }: Props) {
  const { currentDetento, setCurrentDetento } = useDetentoListViewStore();

  const { createDetento } = useCreateDetento();
  const { updateDetento } = useUpdateDetento();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentDetento) {
        await updateDetento(currentDetento.Id, data);
      } else {
        await createDetento(data);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClose = () => {
    dialog.onFalse();
    reset(defaultValues);
    setCurrentDetento(null);
  };

  useEffect(() => {
    if (!currentDetento) return;
    reset(currentDetento);
  }, [currentDetento, reset]);

  return (
    <Dialog open={dialog.value} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>{currentDetento ? 'Editar Detento' : 'Novo Detento'}</DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Field.UploadAvatar
                  name="FotoPerfil"
                  accept={{ 'image/*': [] }}
                  maxSize={3145728}
                />
                <Field.Text name="Nome" label="Nome" />
                <Field.Text name="CID" label="CID" />

                <Stack direction="row" spacing={3}>
                  <Field.Select name="Galeria" label="Galeria">
                    {Object.values(Galeria).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                  <Field.Select name="Cela" label="Cela">
                    {Object.values(Cela).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Field.DatePicker name="DataNascimento" label="Data de Nascimento" />
                  <Field.Phone name="Telefone" label="Telefone" fullWidth />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                  <Field.Select name="Sexo" label="Sexo">
                    {Object.values(Sexo).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Select name="Cor" label="Cor">
                    {Object.values(Cor).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Select name="CorOlhos" label="Cor dos Olhos">
                    {Object.values(CorOlhos).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Field.Select name="Rosto" label="Rosto">
                    {Object.values(Rosto).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                  <Field.Select name="Nariz" label="Nariz">
                    {Object.values(Nariz).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                  <Field.Select name="Boca" label="Boca">
                    {Object.values(Boca).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Field.Select name="Dentes" label="Dentes">
                    {Object.values(Dentes).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Select name="Cabelos" label="Cabelos">
                    {Object.values(Cabelos).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field.Select>
                  <Field.Text name="Altura" label="Altura" />
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Field.Text name="TatuagensLocalizacao" label="Localização das Tatuagens" />
                  <Field.Text name="TatuagensQuantidade" label="Quantidade" />
                </Stack>

                <Field.Text
                  rows={3}
                  multiline
                  name="SinaisParticulares"
                  label="Sinais Particulares"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Field.Upload
                thumbnail
                name="Fotos"
                accept={{ 'image/*': [] }}
                maxSize={3145728}
                multiple
              />
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {currentDetento ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
