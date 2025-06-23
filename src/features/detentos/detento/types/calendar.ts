import type { TipoAtendimento } from './compromisso';

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export interface ICalendarRange {
  start: string;
  end: string;
}

export interface ICalendarEvent {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  allDay: boolean;
  start: string;
  end: string;
}

export interface ICompromissoCalendarEvent extends ICalendarEvent {
  compromissoId: string;
  detentoId: string;
  local: string;
  isRealizado: boolean;
  hasEscolta: boolean;
  isMovimentacaoExterna: boolean;
  observacao?: string;
  tipoAtendimento: TipoAtendimento;
}
