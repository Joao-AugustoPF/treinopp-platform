export enum TipoAtendimento {
  JURIDICO = 'juridico',
  SAUDE = 'saude',
  INTERNACAO = 'internação',
  PSICOLOGIA = 'psicologia',
  EDUCACAO = 'educação',
  ADVOGADO = 'advogado',
}

export interface ICompromisso {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  DetentoId: string;
  DataAgendamentoCompromisso: string;
  HoraAgendamentoCompromisso: string;
  LocalCompromisso: string;
  IsRealizado: boolean;
  HasEscolta: boolean;
  IsMovimentacaoExterna: boolean;
  Observacao: string;
  TipoAtendimento: TipoAtendimento;
}

export interface ICompromissoInput {
  Nome: string;
  DetentoId: string;
  DataAgendamentoCompromisso: string;
  HoraAgendamentoCompromisso: string;
  LocalCompromisso: string;
  IsRealizado?: boolean;
  HasEscolta?: boolean;
  IsMovimentacaoExterna?: boolean;
  Observacao?: string;
  TipoAtendimento: TipoAtendimento;
}

export interface ICompromissoUpdateInput extends Partial<ICompromissoInput> {
  Id: string;
}

export const TIPO_ATENDIMENTO_CORES = {
  [TipoAtendimento.JURIDICO]: '#2196F3', // Azul
  [TipoAtendimento.SAUDE]: '#4CAF50', // Verde
  [TipoAtendimento.INTERNACAO]: '#F44336', // Vermelho
  [TipoAtendimento.PSICOLOGIA]: '#9C27B0', // Roxo
  [TipoAtendimento.EDUCACAO]: '#FF9800', // Laranja
  [TipoAtendimento.ADVOGADO]: '#795548', // Marrom
};

export const TIPO_ATENDIMENTO_LABELS = {
  [TipoAtendimento.JURIDICO]: 'Jurídico',
  [TipoAtendimento.SAUDE]: 'Saúde',
  [TipoAtendimento.INTERNACAO]: 'Internação',
  [TipoAtendimento.PSICOLOGIA]: 'Psicologia',
  [TipoAtendimento.EDUCACAO]: 'Educação',
  [TipoAtendimento.ADVOGADO]: 'Advogado',
};
