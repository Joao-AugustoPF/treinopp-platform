import type { ICalendarRange } from 'src/types/common';

import dayjs from 'dayjs';
import { useMemo } from 'react';

import { TipoAtendimento } from '../types/compromisso';
import { adapterCalendarEventToFormValues } from '../utils';

import type { ICompromissoCalendarEvent } from '../types/calendar';
import type { CompromissoFormValues } from '../sections/compromisso-form';

// ----------------------------------------------------------------------

export function useEvent(
  events: ICompromissoCalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues: CompromissoFormValues = useMemo(() => {
    const startDate = selectedRange
      ? dayjs(selectedRange.start).format('YYYY-MM-DD')
      : dayjs(new Date()).format('YYYY-MM-DD');

    const startHour = selectedRange
      ? dayjs(selectedRange.start).format('HH:mm')
      : dayjs(new Date()).format('HH:mm');

    return {
      Nome: '',
      DetentoId: '',
      DataAgendamentoCompromisso: startDate,
      HoraAgendamentoCompromisso: startHour,
      LocalCompromisso: '',
      TipoAtendimento: TipoAtendimento.JURIDICO,
      Observacao: '',
      HasEscolta: false,
      IsMovimentacaoExterna: false,
      IsRealizado: false,
      Id: '',
    };
  }, [selectedRange]);

  if (!openForm) {
    return undefined;
  }

  if (currentEvent) {
    return { ...defaultValues, ...adapterCalendarEventToFormValues(currentEvent) };
  }

  return defaultValues as CompromissoFormValues;
}
