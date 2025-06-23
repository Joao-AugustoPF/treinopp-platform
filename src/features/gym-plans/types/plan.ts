export interface IPlan {
  Id: string;
  Nome: string;
  Valor: number;
  Duracao: number;
  // features: string[];
  // isActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ICreatePlanInput {
  Nome: string;
  Valor: number;
  Duracao: number;
  TenantId: string;
}

export interface IUpdatePlanInput extends Partial<ICreatePlanInput> {}
