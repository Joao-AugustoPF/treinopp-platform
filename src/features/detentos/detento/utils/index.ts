import { TipoAtendimento } from '../types/compromisso';

import type { ICompromisso } from '../types/compromisso';
import type { ICompromissoCalendarEvent } from '../types/calendar';
import type { CompromissoFormValues } from '../sections/compromisso-form';

export const adaptCompromissoToCalendarEvent = (event: ICompromisso): ICompromissoCalendarEvent => {
  const startDate = new Date(
    `${event.DataAgendamentoCompromisso}T${event.HoraAgendamentoCompromisso}`
  );

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  return {
    title: event.Nome,
    description: event.Observacao || '',
    backgroundColor: getColorByTipoAtendimento(event.TipoAtendimento),
    borderColor: getColorByTipoAtendimento(event.TipoAtendimento),
    textColor: '#fff',
    allDay: false,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    id: event.Id,
    compromissoId: event.Id,
    detentoId: event.DetentoId,
    local: event.LocalCompromisso,
    isRealizado: event.IsRealizado,
    hasEscolta: event.HasEscolta,
    isMovimentacaoExterna: event.IsMovimentacaoExterna,
    observacao: event.Observacao,
    tipoAtendimento: event.TipoAtendimento,
  };
};

export const adaptCalendarEventToCompromisso = (
  event: ICompromissoCalendarEvent
): Partial<ICompromisso> => {
  const startDate = new Date(event.start);

  return {
    Id: event.compromissoId,
    Nome: event.title,
    DetentoId: event.detentoId,
    DataAgendamentoCompromisso: startDate.toISOString().split('T')[0],
    HoraAgendamentoCompromisso: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
    LocalCompromisso: event.local,
    IsRealizado: event.isRealizado,
    HasEscolta: event.hasEscolta,
    IsMovimentacaoExterna: event.isMovimentacaoExterna,
    Observacao: event.observacao,
    TipoAtendimento: event.tipoAtendimento,
  };
};

export const adapterCalendarEventToFormValues = (
  event: ICompromissoCalendarEvent
): CompromissoFormValues => {
  const startDate = event?.start?.split('T')[0];
  const startHour = `${event?.start?.split('T')[1].split(':')[0]}:${event?.start?.split('T')[1].split(':')[1]}`;

  return {
    DataAgendamentoCompromisso: startDate,
    HoraAgendamentoCompromisso: startHour,
    LocalCompromisso: event?.local,
    TipoAtendimento: event?.tipoAtendimento,
    Observacao: event?.observacao,
    HasEscolta: event?.hasEscolta,
    IsMovimentacaoExterna: event?.isMovimentacaoExterna,
    Nome: event?.title,
    DetentoId: event?.detentoId,
  };
};

function getColorByTipoAtendimento(tipo: TipoAtendimento): string {
  const colors: Record<TipoAtendimento, string> = {
    [TipoAtendimento.JURIDICO]: '#2196F3',
    [TipoAtendimento.SAUDE]: '#4CAF50',
    [TipoAtendimento.INTERNACAO]: '#F44336',
    [TipoAtendimento.PSICOLOGIA]: '#9C27B0',
    [TipoAtendimento.EDUCACAO]: '#FF9800',
    [TipoAtendimento.ADVOGADO]: '#795548',
  };
  return colors[tipo] || '#757575';
}
