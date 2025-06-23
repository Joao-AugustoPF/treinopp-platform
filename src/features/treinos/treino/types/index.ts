export enum TipoTreino {
  FORCA = 'Força',
  CARDIO = 'Cardio',
  FLEXIBILIDADE = 'Flexibilidade',
  HIIT = 'HIIT',
}

export interface IExercicio {
  Id: string;
  Nome: string;
  Series: number;
  Repeticoes: number;
  Peso: number;
  Observacoes?: string;
}

export interface ITreino {
  Id: string;
  Nome: string;
  TipoTreino: TipoTreino;
  AlunoId: string;
  TreinadorId: string;
  Exercicios: IExercicio[];
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
}

export interface ITreinoTableFilters {
  name: string;
  TipoTreino: string;
}
