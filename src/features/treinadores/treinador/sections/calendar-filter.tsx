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

import { TIPO_EVENTO_CORES, TIPO_EVENTO_LABELS } from '../types/calendar';

import type { TipoEvento , IAgendaCalendarEvent } from '../types/calendar';


type CalendarFilterProps = {
  open: boolean;
  onClose: VoidFunction;
  events: IAgendaCalendarEvent[];
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
  const renderEventTypes = Object.entries(TIPO_EVENTO_LABELS).map(([key, label]) => {
    const tipo = key as TipoEvento;
    const color = TIPO_EVENTO_CORES[tipo];
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
          <Typography variant="subtitle2">Tipo de Evento</Typography>
          <FormGroup>{renderEventTypes}</FormGroup>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Eventos</Typography>
          <Stack spacing={1}>
            {events
              .filter(
                (event) => colorPreference.includes(event.tipoEvento) && !!event.title.trim().length
              )
              .map((event) => (
                <Stack
                  key={event.id}
                  component="button"
                  onClick={() => onClickEvent(event.id)}
                  sx={{
                    border: 0,
                    p: 1.5,
                    typography: 'body2',
                    textAlign: 'left',
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    cursor: 'pointer',
                  }}
                >
                  {event.title}
                </Stack>
              ))}
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
}
