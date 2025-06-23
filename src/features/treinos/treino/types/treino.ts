export interface ITreino {
  Id: string;
  Nome: string;
  TipoTreino: string;
  AlunoId: string;
  Exercicios: IExercicio[];
  DataCriacao: string;
  DataAtualizacao: string;
}

export interface IExercicio {
  Id: string;
  Nome: string;
  Series: number;
  Repeticoes: number;
  Peso: number;
  Observacoes: string;
}
