export enum StatusMensalidade {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  ATRASADO = 'ATRASADO',
  CANCELADO = 'CANCELADO',
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  PIX = 'PIX',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  BOLETO = 'BOLETO',
}

export interface IMensalidade {
  Id: string;
  AlunoId: string;
  PlanoId: string;
  MesReferencia: string; // YYYY-MM
  DataVencimento: string;
  DataPagamento?: string;
  Valor: number;
  Status: StatusMensalidade;
  FormaPagamento?: FormaPagamento;
  Observacoes?: string;
  PagamentoId?: string; // Referência ao pagamento se houver
  TenantId: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
}

export interface IMensalidadeCreate {
  AlunoId: string;
  PlanoId: string;
  MesReferencia: string;
  DataVencimento: string;
  Valor: number;
  Observacoes?: string;
}

export interface IMensalidadeUpdate {
  Status?: StatusMensalidade;
  DataPagamento?: string;
  FormaPagamento?: FormaPagamento;
  Observacoes?: string;
  PagamentoId?: string;
}

export interface IMensalidadeListResponse {
  data: {
    mensalidades: IMensalidade[];
    total: number;
  };
} 