import type { TipoAula } from 'src/features/aulas/types';

import type { TipoEvento } from './calendar';

export interface IAgenda {
  Id: string;
  Titulo: string;
  TreinadorId: string;
  DataInicio: string;
  HoraInicio: string;
  DataFim?: string;
  HoraFim?: string;
  Local: string;
  TipoEvento: TipoEvento;
  TipoAula?: TipoAula;
  CapacidadeMaxima?: number;
  VagasDisponiveis?: number;
  AlunoId?: string;
  Observacao?: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  bookingId?: string;
  isBooking?: boolean;
}

export type AgendaCreateSchemaType = Omit<
  IAgenda,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export type AgendaUpdateSchemaType = Partial<AgendaCreateSchemaType> & {
  Id: string;
};
