export enum StatusAvaliacao {
  AGENDADA = 'booked',
  CANCELADA = 'cancelled',
  REALIZADA = 'attended',
}

export interface IPerfil {
  UserId: string;
  Nome: string;
  AvatarUrl?: string;
  Email: string;
  Role: string;
  Telefone?: string;
  TenantId: string;
  Status: string;
  Id: string;
}

export interface ISlotAvaliacao {
  Id: string;
  TenantId: string;
  DataInicio: string;
  DataFim: string;
  Local: string;
  PerfilTreinadorId: IPerfil;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
}

export interface IAvaliacao {
  Id: string;
  Status: StatusAvaliacao;
  DataCheckIn?: string;
  TenantId: string;
  PerfilMembroId: IPerfil;
  SlotAvaliacaoId: ISlotAvaliacao;
  Observacoes: string;
  Objetivos: string[];
  Restricoes: string[];
  HistoricoMedico: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  TreinadorId?: string;
  IsDeleted: boolean;
}

export interface IAvaliacaoTableFilters {
  search?: string;
  status?: StatusAvaliacao;
  dataInicio?: string;
  dataFim?: string;
}

export type AvaliacaoCreateSchemaType = Omit<
  IAvaliacao,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export type AvaliacaoUpdateSchemaType = Partial<AvaliacaoCreateSchemaType> & {
  Id: string;
};

export type SlotAvaliacaoCreateSchemaType = Omit<
  ISlotAvaliacao,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export type SlotAvaliacaoUpdateSchemaType = Partial<SlotAvaliacaoCreateSchemaType> & {
  Id: string;
};

export const transformAvaliacao = (data: any): IAvaliacao => ({
  Id: data.$id,
  Status: data.status as StatusAvaliacao,
  DataCheckIn: data.checkInAt,
  TenantId: data.tenantId,
  Observacoes: data.notes,
  Objetivos: data.objectives,
  Restricoes: data.restrictions,
  HistoricoMedico: data.medicalHistory,
  PerfilMembroId: {
    Id: data.memberProfileId.$id,
    UserId: data.memberProfileId.userId,
    Nome: data.memberProfileId.name,
    AvatarUrl: data.memberProfileId.avatarUrl,
    Email: data.memberProfileId.email,
    Role: data.memberProfileId.role,
    Telefone: data.memberProfileId.phoneNumber,
    TenantId: data.memberProfileId.tenantId,
    Status: data.memberProfileId.status,
  },

  SlotAvaliacaoId: {
    Id: data.evaluationSlots.$id,
    TenantId: data.evaluationSlots.tenantId,
    DataInicio: data.evaluationSlots.start,
    DataFim: data.evaluationSlots.end,
    Local: data.evaluationSlots.location,
    PerfilTreinadorId: {
      Id: data.evaluationSlots.trainerProfileId.$id,
      UserId: data.evaluationSlots.trainerProfileId.userId,
      Nome: data.evaluationSlots.trainerProfileId.name,
      AvatarUrl: data.evaluationSlots.trainerProfileId.avatarUrl,
      Email: data.evaluationSlots.trainerProfileId.email,
      Role: data.evaluationSlots.trainerProfileId.role,
      Telefone: data.evaluationSlots.trainerProfileId.phoneNumber,
      TenantId: data.evaluationSlots.trainerProfileId.tenantId,
      Status: data.evaluationSlots.trainerProfileId.status,
    },
    CreatedAt: data.evaluationSlots.$createdAt,
    CreatedBy: '',
    UpdatedAt: data.evaluationSlots.$updatedAt,
    UpdatedBy: '',
    IsDeleted: false,
  },
  CreatedAt: data.$createdAt,
  CreatedBy: '',
  UpdatedAt: data.$updatedAt,
  UpdatedBy: '',
  IsDeleted: false,
});
