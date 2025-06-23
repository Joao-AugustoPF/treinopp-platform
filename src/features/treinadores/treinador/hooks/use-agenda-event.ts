import dayjs from 'dayjs';
import { useMemo } from 'react';

import { TipoEvento } from '../types/calendar';
import { adaptCalendarEventToFormValues } from '../utils';

import type { ICalendarRange, IAgendaCalendarEvent } from '../types/calendar';

export function useAgendaEvent(
  events: IAgendaCalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange | null,
  openForm: boolean,
  treinadorId: string
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues: IAgendaCalendarEvent = useMemo(
    () => ({
      id: '',
      agendaId: '',
      treinadorId,
      title: '',
      description: '',
      local: '',
      tipoEvento: TipoEvento.AULA,
      backgroundColor: '#00AB55',
      borderColor: '#00AB55',
      textColor: '#fff',
      allDay: false,
      start: selectedRange ? selectedRange.start : dayjs(new Date()).format(),
      end: selectedRange ? selectedRange.end : dayjs(new Date()).add(1, 'hour').format(),
    }),
    [selectedRange, treinadorId]
  );

  const agendaData = useMemo(() => {
    if (!openForm) return null;
    const eventData = currentEvent || defaultValues;
    return adaptCalendarEventToFormValues(eventData);
  }, [openForm, currentEvent, defaultValues]);

  if (!openForm) {
    return { eventData: undefined, agendaData: undefined };
  }

  return {
    eventData: currentEvent || defaultValues,
    agendaData,
  };
}
