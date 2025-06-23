'use client';

import {
  Stack,
  Drawer,
  Checkbox,
  FormGroup,
  Typography,
  IconButton,
  FormControlLabel,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { TIPO_ATENDIMENTO_CORES, TIPO_ATENDIMENTO_LABELS } from '../types/compromisso';

import type { TipoAtendimento } from '../types/compromisso';
import type { ICompromissoCalendarEvent } from '../types/calendar';

type CalendarFilterProps = {
  open: boolean;
  onClose: VoidFunction;
  events: ICompromissoCalendarEvent[];
  onClickEvent: (eventId: string) => void;
  colorPreference: string[];
  onChangeColor: (color: string[]) => void;
};

export function CalendarFilter({
  open,
  onClose,
  events,
  colorPreference,
  onClickEvent,
  onChangeColor,
}: CalendarFilterProps) {
  const renderEventTypes = Object.entries(TIPO_ATENDIMENTO_LABELS).map(([key, label]) => {
    const tipo = key as TipoAtendimento;
    const color = TIPO_ATENDIMENTO_CORES[tipo];
    const checked = colorPreference.includes(tipo);

    return (
      <FormControlLabel
        key={tipo}
        control={
          <Checkbox
            checked={checked}
            onChange={() => {
              const newColorPreference = checked
                ? colorPreference.filter((value) => value !== tipo)
                : [...colorPreference, tipo];

              onChangeColor(newColorPreference);
            }}
            sx={{
              color,
              '&.Mui-checked': { color },
            }}
          />
        }
        label={label}
        sx={{ width: 1 }}
      />
    );
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6">Filtros</Typography>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Stack spacing={3} sx={{ px: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Tipo de Atendimento</Typography>
          <FormGroup>{renderEventTypes}</FormGroup>
        </Stack>
      </Stack>
    </Drawer>
  );
}
