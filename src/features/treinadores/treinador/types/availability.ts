export interface IDisponibilidade {
  Id: string;
  TreinadorId: string;
  DiaSemana: number; // 0-6 (Domingo-Sábado)
  HoraInicio: string; // formato "HH:mm"
  HoraFim: string; // formato "HH:mm"
  DuracaoSlot: number; // duração em minutos de cada slot
  IntervaloEntreSlots: number; // intervalo em minutos entre slots
  HorariosBloqueados: IHorarioBloqueado[]; // horários bloqueados específicos
  IsDeleted: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
}

export interface IHorarioBloqueado {
  Id: string;
  Data: string; // formato "YYYY-MM-DD"
  HoraInicio: string; // formato "HH:mm"
  HoraFim: string; // formato "HH:mm"
  Motivo: string;
}

export interface ISlotDisponivel {
  Id: string;
  TreinadorId: string;
  Data: string; // formato "YYYY-MM-DD"
  HoraInicio: string; // formato "HH:mm"
  HoraFim: string; // formato "HH:mm"
  IsDisponivel: boolean;
}

export const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

export const HORARIOS_PADRAO = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] as const;
