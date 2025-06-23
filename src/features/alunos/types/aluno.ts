export * from './aluno';
export * from './mensalidade';

export type IPaymentHistory = {
  $id: string;
  gateway: 'stripe' | 'mercadoPago';
  gatewayRef: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  paidAt: Date;
};

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum PlanoTipo {
  BASICO = 'Plano Básico',
  PREMIUM = 'Plano Premium',
  VIP = 'Plano VIP',
}

export interface IAluno {
  Id: string;
  Nome: string;
  Email: string;
  Telefone: string;
  DataNascimento: string;
  CPF: string;
  Foto?: string | File | null;
  Endereco: {
    Logradouro: string;
    Numero: string;
    Complemento?: string;
    Bairro: string;
    Cidade: string;
    Estado: string;
    CEP: string;
  };
  Status: Status;
  Plano: {
    Id: string;
    Nome: string;
    Valor: number;
    Descricao?: string;
    DataInicio?: string;
    DataFim?: string;
  };
  TreinadorId?: string;
  Treinador?: {
    Id: string;
    Nome: string;
  };
  MaxBookings?: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface IAlunoListResponse {
  data: {
    alunos: IAluno[];
    total: number;
  };
}

export interface IAlunoResponse {
  data: IAluno;
}

// Tipos para filtros seguindo o padrão dos produtos
export interface IAlunoFilters {
  search: string;
  status: string;
}

export interface IAlunoTableFilters {
  search: string;
  tenantId: string;
  status: string;
}

export type AlunoCreateSchemaType = Omit<IAluno, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
