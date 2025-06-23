export interface IAcademia {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
  Permissions: string[];
  Name: string;
  Slug: string;
  AddressStreet: string;
  AddressCity: string;
  AddressState: string;
  AddressZip: string;
  AddressNumber: string;
  Lat?: number;
  Lng?: number;
  Phone?: string;
  LogoUrl?: string;
  PaymentGateway: 'stripe' | 'mercadoPago';
  GatewayKey?: string;
  OwnerProfileId?: string;
  TenantId: string;
  // Email: string;
}

export interface IAcademiaFilters {
  Search?: string;
  Estado?: string;
  Cidade?: string;
}

export type AcademiaCreateSchemaType = Omit<
  IAcademia,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export interface IAcademiaHistorico {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
  AcademiaId: string;
  AcademiaNome?: string;
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
