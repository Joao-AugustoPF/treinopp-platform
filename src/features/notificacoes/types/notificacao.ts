export enum NotificacaoTipo {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface INotificacao {
  Id: string;
  Titulo: string;
  Mensagem: string;
  Tipo: NotificacaoTipo;
  TenantId: string;
  ReadBy: string[];
  DeletedBy: string[];
  CreatedAt: string;
  UpdatedAt: string;
}

export interface INotificacaoListResponse {
  data: {
    notificacoes: INotificacao[];
    total: number;
  };
}

export interface INotificacaoResponse {
  data: INotificacao;
}

export interface INotificacaoFilters {
  search: string;
  tipo: string;
}

export interface INotificacaoTableFilters {
  search: string;
  tipo: string;
}

export type NotificacaoCreateSchemaType = {
  Titulo: string;
  Mensagem: string;
  Tipo: NotificacaoTipo;
};

export type NotificacaoUpdateSchemaType = Partial<{
  Titulo: string;
  Mensagem: string;
  Tipo: NotificacaoTipo;
}>;
