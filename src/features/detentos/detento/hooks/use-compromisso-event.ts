import dayjs from 'dayjs';
import { useMemo } from 'react';

import { TipoAtendimento } from '../types/compromisso';
import { adaptCalendarEventToCompromisso } from '../utils';

import type { ICalendarRange, ICompromissoCalendarEvent } from '../types/calendar';

export function useCompromissoEvent(
  events: ICompromissoCalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange | null,
  openForm: boolean,
  detentoId: string
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues: ICompromissoCalendarEvent = useMemo(
    () => ({
      id: '',
      compromissoId: '',
      detentoId,
      title: '',
      description: '',
      local: '',
      isRealizado: false,
      hasEscolta: false,
      isMovimentacaoExterna: false,
      observacao: '',
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      tipoAtendimento: TipoAtendimento.JURIDICO,
      textColor: '#fff',
      allDay: false,
      start: selectedRange ? selectedRange.start : dayjs(new Date()).format(),
      end: selectedRange ? selectedRange.end : dayjs(new Date()).add(1, 'hour').format(),
    }),
    [selectedRange, detentoId]
  );

  const compromissoData = useMemo(() => {
    if (!openForm) return null;
    const eventData = currentEvent || defaultValues;
    return adaptCalendarEventToCompromisso(eventData);
  }, [openForm, currentEvent, defaultValues]);

  if (!openForm) {
    return { eventData: undefined, compromissoData: undefined };
  }

  return {
    eventData: currentEvent || defaultValues,
    compromissoData,
  };
}
