import { TIPO_EVENTO_CORES } from '../types/calendar';

import type { IAgenda } from '../types/agenda';
import type { TipoTreinamento } from '../types/treinador';
import type { AgendaFormValues } from '../sections/agenda-form';
import type {
  TipoEvento,
  IAgendaCalendarEvent,
} from '../types/calendar';

export const getColorByTipoEvento = (tipo: TipoEvento): string =>
  TIPO_EVENTO_CORES[tipo] || '#2196F3';

export const adaptAgendaToCalendarEvent = (agenda: IAgenda): IAgendaCalendarEvent => {
  try {
    let startDate: Date;
    let endDate: Date;

    // Verificar se DataInicio está no formato ISO do Appwrite (com timezone)
    if (agenda.DataInicio && agenda.DataInicio.includes('T') && (agenda.DataInicio.includes('+') || agenda.DataInicio.includes('Z'))) {
      // Formato ISO do Appwrite: "2025-06-05T12:21:29.148+00:00" ou "2025-06-05T12:21:29.148Z"
      console.log('=== FORMATO ISO DETECTADO ===');
      console.log('DataInicio ISO:', agenda.DataInicio);
      console.log('DataFim ISO:', agenda.DataFim);

      // Usar o comportamento padrão do JavaScript para ISO
      startDate = new Date(agenda.DataInicio);
      endDate = agenda.DataFim ? new Date(agenda.DataFim) : new Date(startDate.getTime() + 60 * 60 * 1000);
    } else {
      // Formato separado: DataInicio (YYYY-MM-DD) + HoraInicio (HH:mm)
      console.log('=== FORMATO SEPARADO DETECTADO ===');
      console.log('DataInicio:', agenda.DataInicio, 'HoraInicio:', agenda.HoraInicio);
      console.log('DataFim:', agenda.DataFim, 'HoraFim:', agenda.HoraFim);

      const startDateStr = agenda.DataInicio ? agenda.DataInicio.split('T')[0] : '';
      const startTimeStr = agenda.HoraInicio || '00:00';
      startDate = new Date(`${startDateStr}T${startTimeStr}`);

      if (agenda.DataFim && agenda.HoraFim) {
        const endDateStr = agenda.DataFim.split('T')[0];
        endDate = new Date(`${endDateStr}T${agenda.HoraFim}`);
      } else {
        endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);
      }
    }

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date values:', {
        agenda: agenda,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      // Return a default date if invalid
      const now = new Date();
      const defaultEnd = new Date(now);
      defaultEnd.setHours(now.getHours() + 1);

      return {
        id: agenda.Id,
        title: agenda.Titulo || 'Evento',
        description: agenda.Observacao || '',
        backgroundColor: getColorByTipoEvento(agenda.TipoEvento),
        borderColor: getColorByTipoEvento(agenda.TipoEvento),
        textColor: '#fff',
        allDay: false,
        start: now.toISOString(),
        end: defaultEnd.toISOString(),
        bookingId: agenda.bookingId || '',
        isBooking: agenda.isBooking || false,
        agendaId: agenda.Id,
        treinadorId: agenda.TreinadorId,
        local: agenda.Local || 'Local não especificado',
        tipoEvento: agenda.TipoEvento,
        tipoAula: agenda.TipoAula,
        capacidadeMaxima: agenda.CapacidadeMaxima,
        vagasDisponiveis: agenda.VagasDisponiveis,
        alunoId: agenda.AlunoId,
        observacao: agenda.Observacao,
      };
    }

    const event: IAgendaCalendarEvent = {
      id: agenda.Id,
      title: agenda.Titulo || 'Evento',
      description: agenda.Observacao || '',
      backgroundColor: getColorByTipoEvento(agenda.TipoEvento),
      borderColor: getColorByTipoEvento(agenda.TipoEvento),
      textColor: '#fff',
      allDay: false,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      agendaId: agenda.Id,
      treinadorId: agenda.TreinadorId,
      local: agenda.Local || '',
      tipoEvento: agenda.TipoEvento,
      bookingId: agenda.bookingId || '',
      isBooking: agenda.isBooking || false,
      tipoAula: agenda.TipoAula,
      capacidadeMaxima: agenda.CapacidadeMaxima,
      vagasDisponiveis: agenda.VagasDisponiveis,
      alunoId: agenda.AlunoId,
      observacao: agenda.Observacao,
    };

    console.log('=== EVENT ADAPTED ===');
    console.log('Original agenda:', agenda);
    console.log('Adapted event:', event);
    console.log('Start date (local):', startDate.toLocaleString('pt-BR'));
    console.log('End date (local):', endDate.toLocaleString('pt-BR'));
    console.log('===================');

    return event;
  } catch (error) {
    console.error('Error adapting agenda to calendar event:', error, agenda);
    // Return a default event with current time
    const now = new Date();
    const defaultEnd = new Date(now);
    defaultEnd.setHours(now.getHours() + 1);

    return {
      id: agenda.Id,
      title: agenda.Titulo || 'Evento',
      description: agenda.Observacao || '',
      backgroundColor: getColorByTipoEvento(agenda.TipoEvento),
      borderColor: getColorByTipoEvento(agenda.TipoEvento),
      textColor: '#fff',
      allDay: false,
      start: now.toISOString(),
      end: defaultEnd.toISOString(),
      agendaId: agenda.Id,
      treinadorId: agenda.TreinadorId,
      local: agenda.Local || 'Local não especificado',
      tipoEvento: agenda.TipoEvento,
      tipoAula: agenda.TipoAula,
      bookingId: agenda.bookingId || '',
      isBooking: agenda.isBooking || false,
      capacidadeMaxima: agenda.CapacidadeMaxima,
      vagasDisponiveis: agenda.VagasDisponiveis,
      alunoId: agenda.AlunoId,
      observacao: agenda.Observacao,
    };
  }
};

export const adaptCalendarEventToAgenda = (event: any): Partial<any> => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return {
    Id: event.agendaId,
    Titulo: event.title,
    TreinadorId: event.treinadorId,
    DataInicio: startDate.toISOString().split('T')[0],
    HoraInicio: startDate.toISOString().split('T')[1].substring(0, 5),
    DataFim: endDate.toISOString().split('T')[0],
    HoraFim: endDate.toISOString().split('T')[1].substring(0, 5),
    Local: event.local,
    TipoEvento: event.tipoEvento,
    TipoAula: event.tipoAula,
    BookingId: event.bookingId,
    IsBooking: event.isBooking,
    CapacidadeMaxima: event.capacidadeMaxima,
    VagasDisponiveis: event.vagasDisponiveis,
    AlunoId: event.alunoId,
    Observacao: event.observacao,
  };
};

export const adaptCalendarEventToFormValues = (event: IAgendaCalendarEvent): AgendaFormValues => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  console.log('event', event);
  return {
    Id: event.agendaId,
    Titulo: event.title,
    TreinadorId: event.treinadorId,
    bookingId: event.bookingId,
    isBooking: event.isBooking,
    DataInicio: startDate,
    DataFim: endDate,
    Local: event.local,
    TipoEvento: event.tipoEvento,
    TipoAula: event.tipoAula,
    CapacidadeMaxima: event.capacidadeMaxima || 0,
    VagasDisponiveis: event.vagasDisponiveis || 0,
    AlunoId: event.alunoId || '',
    Observacao: event.observacao || '',
  };
};

export const adaptTreinamentoEventToFormValues = (
  event: any
): any => {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  return {
    Id: event.id,
    Nome: event.title,
    TreinadorId: event.treinadorId,
    AlunoId: event.alunoId,
    DataAgendamentoTreinamento: startDate.toISOString().split('T')[0],
    HoraAgendamentoTreinamento: startDate.toISOString().split('T')[1].substring(0, 5),
    LocalTreinamento: event.local,
    BookingId: event.bookingId || '',
    IsBooking: event.isBooking || false,
    TipoTreinamento: event.tipoTreinamento as TipoTreinamento,
    IsRealizado: event.isRealizado,
    HasEquipamento: event.hasEquipamento,
    IsTreinamentoExterno: event.isTreinamentoExterno,
    Observacao: event.observacao || '',
  };
};
