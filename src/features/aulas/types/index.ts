export enum TipoAula {
  YOGA = 'yoga',
  FUNCIONAL = 'funcional',
  // HIIT = 'HIIT',
  // JUMP = 'Jump',
  // ZUMBA = 'Zumba',
  // PILATES = 'Pilates',
  // SPINNING = 'spinning',
  // DANCA = 'dança',
  OUTRO = 'outro',
}

export interface ITreinadorObject {
  Id: string;
  $id?: string;
  Nome: string;
  // Add other trainer properties as needed
}

export interface IAula {
  Id: string;
  Nome: string;
  TipoAula: TipoAula;
  TreinadorId: string | ITreinadorObject;
  DataInicio: string;
  DataFim: string;
  Local: string;
  Capacidade: number;
  Status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  TenantId: string;
}
