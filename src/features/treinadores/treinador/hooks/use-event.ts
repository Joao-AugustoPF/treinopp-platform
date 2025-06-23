import type { ICalendarRange } from 'src/types/common';

import dayjs from 'dayjs';
import { useMemo } from 'react';

import { TipoEvento } from '../types/calendar';
import { adaptCalendarEventToFormValues } from '../utils';

import type { IAgendaCalendarEvent } from '../types/calendar';
import type { AgendaFormValues } from '../sections/agenda-form';

// ----------------------------------------------------------------------

export function useEvent(
  events: IAgendaCalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean,
  treinadorId: string
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues: AgendaFormValues = useMemo(() => {
    // Handle both clicking on calendar day and selecting a time range
    const startDate = selectedRange ? dayjs(selectedRange.start).toDate() : new Date();

    const endDate = selectedRange
      ? dayjs(selectedRange.end).toDate()
      : dayjs(startDate).add(1, 'hour').toDate();

    return {
      Id: '',
      Titulo: '',
      TreinadorId: treinadorId,
      AlunoNome: '',
      DataInicio: startDate,
      DataFim: endDate,
      Local: '',
      TipoEvento: TipoEvento.AULA,
      TipoAula: undefined,
      CapacidadeMaxima: 0,
      VagasDisponiveis: 0,
      AlunoId: '',
      Observacao: '',
      isBooking: false,
      bookingId: '',
    };
  }, [selectedRange, treinadorId]);

  if (!openForm) {
    return undefined;
  }

  console.log('currentEvent', currentEvent);

  if (currentEvent) {
    const adaptedValues = adaptCalendarEventToFormValues(currentEvent);
    return {
      ...defaultValues,
      ...adaptedValues,
      // Ensure AlunoId is properly set from the event
      AlunoId: currentEvent.alunoId || '',
      bookingId: currentEvent.bookingId || '',
      isBooking: currentEvent.isBooking || false,
    };
  }

  return defaultValues;
}
