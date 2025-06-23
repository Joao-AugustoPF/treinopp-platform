import type { TipoAula } from 'src/features/aulas/types';

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

export enum TipoEvento {
  AULA = 'Aula',
  AVALIACAO = 'Avaliação',
  PERSONALIZACAO = 'Personalização',
  OUTRO = 'Outro',
}

export const TIPO_EVENTO_CORES = {
  [TipoEvento.AULA]: '#00AB55', // Verde
  [TipoEvento.AVALIACAO]: '#1890FF', // Azul
  [TipoEvento.PERSONALIZACAO]: '#FFC107', // Amarelo
  [TipoEvento.OUTRO]: '#FF4842', // Vermelho
};

export const TIPO_EVENTO_LABELS = {
  [TipoEvento.AULA]: 'Aula',
  [TipoEvento.AVALIACAO]: 'Avaliação',
  [TipoEvento.PERSONALIZACAO]: 'Personalização',
  [TipoEvento.OUTRO]: 'Outro',
};

export interface IAgendaCalendarEvent {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allDay?: boolean;
  start: string;
  end: string;
  agendaId: string;
  treinadorId: string;
  local: string;
  tipoEvento: TipoEvento;
  tipoAula?: TipoAula;
  capacidadeMaxima?: number;
  vagasDisponiveis?: number;
  alunoId?: string;
  observacao?: string;
  bookingId?: string;
  isBooking?: boolean;
  BookingId?: string;
}

export interface ICompromissoCalendarEvent extends ICalendarEvent {
  treinadorId: string;
  alunoId: string;
  local: string;
  tipoTreinamento: string;
  isRealizado: boolean;
  hasEquipamento: boolean;
  isTreinamentoExterno: boolean;
  observacao?: string;
}

export interface ITreinamentoCalendarEvent extends ICalendarEvent {
  treinadorId: string;
  alunoId: string;
  local: string;
  tipoTreinamento: string;
  isRealizado: boolean;
  hasEquipamento: boolean;
  isTreinamentoExterno: boolean;
  observacao?: string;
  isBooking?: boolean;
  BookingId?: string;
  bookingId?: string;
}
