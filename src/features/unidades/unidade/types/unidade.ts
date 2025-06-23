export interface IUnidade {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  NomeExibicao: string;
  Email: string;
  Logradouro: string;
  Cep: string;
  Cidade: string;
  Estado: string;
  LogradouroNumero: string;
  Telefone: string;
  SiglaUnidade: string;
}

export type UnidadeCreateSchemaType = Omit<
  IUnidade,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export interface IUnidadeHistorico {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
  UnidadeId: string;
  UnidadeNome?: string;
  Comportamento: 'Bom' | 'Regular' | 'Ruim';
  Historico: string;
  IsDeleted: boolean;
}

export enum Estado {
  SP = 'SP',
  RJ = 'RJ',
  MG = 'MG',
  BA = 'BA',
  PR = 'PR',
}

export enum Cidade {
  SAO_PAULO = 'São Paulo',
  RIO_DE_JANEIRO = 'Rio de Janeiro',
  BELO_HORIZONTE = 'Belo Horizonte',
  SALVADOR = 'Salvador',
  CURITIBA = 'Curitiba',
}
