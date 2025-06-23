export enum StatusTreinador {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  FERIAS = 'Férias',
  AFASTADO = 'Afastado',
}

export enum Sexo {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
  OUTRO = 'Outro',
}

export enum Nivel {
  JUNIOR = 'Júnior',
  PLENO = 'Pleno',
  SENIOR = 'Sênior',
  ESPECIALISTA = 'Especialista',
  MASTER = 'Master',
}

export enum Especialidade {
  MUSCULACAO = 'Musculação',
  PILATES = 'Pilates',
  CROSSFIT = 'CrossFit',
  YOGA = 'Yoga',
  FUNCIONAL = 'Funcional',
  NATACAO = 'Natação',
  LUTAS = 'Lutas',
  DANCA = 'Dança',
  CORRIDA = 'Corrida',
  CARDIO = 'Cardio',
}

export enum Status {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  FERIAS = 'Férias',
  AFASTADO = 'Afastado',
  DEMITIDO = 'Demitido',
}

export enum TipoTreinamento {
  FORCA = 'Força',
  CARDIO = 'Cardio',
  FLEXIBILIDADE = 'Flexibilidade',
  EQUILIBRIO = 'Equilíbrio',
  RESISTENCIA = 'Resistência',
  COORDENACAO = 'Coordenação',
  AGILIDADE = 'Agilidade',
  VELOCIDADE = 'Velocidade',
  POTENCIA = 'Potência',
  RECUPERACAO = 'Recuperação',
}

export interface IEndereco {
  Cep: string;
  Logradouro: string;
  Numero: string;
  Complemento: string | null;
  Bairro: string;
  Cidade: string;
  Estado: string;
}

export interface ITreinador {
  Id: string;
  Nome: string;
  Email: string;
  Telefone: string;
  DataNascimento: string;
  Especialidades: string[];
  Status: StatusTreinador | Status;
  Foto?: string;
  Biografia?: string;
  Certificacoes?: string[];
  HorariosDisponiveis?: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  FotoPerfil?: string | null;
  CPF?: string;
  Sexo?: Sexo;
  Especialidade?: Especialidade;
  Nivel?: Nivel;
  DataContratacao?: string;
  Salario?: number;
  Observacao?: string | null;
  Endereco?: IEndereco;
  historico?: ITreinadorHistorico[];
}

export interface ITreinadorHistorico {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  TreinadorId: string;
  AcademiaId: string;
  DataInicio: string;
  DataFim: string | null;
  Motivo: string;
  Observacao: string | null;
}

export interface ITreinadorAvaliacao {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  TreinadorId: string;
  AlunoId: string;
  DataAvaliacao: string;
  Nota: number;
  Comentario: string;
}

export interface ITreinadorTableFilters {
  search: string;
  status: string;
}

export type TreinadorCreateSchemaType = Omit<
  ITreinador,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export type TreinadorUpdateSchemaType = Partial<TreinadorCreateSchemaType> & {
  Id: string;
};

export interface ITreinamento {
  Id: string;
  Nome: string;
  TreinadorId: string;
  AlunoId: string;
  DataAgendamentoTreinamento: string;
  HoraAgendamentoTreinamento: string;
  LocalTreinamento: string;
  IsRealizado: boolean;
  HasEquipamento: boolean;
  IsTreinamentoExterno: boolean;
  Observacao?: string;
  TipoTreinamento: TipoTreinamento;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
}

export type TreinamentoCreateSchemaType = Omit<
  ITreinamento,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;

export type TreinamentoUpdateSchemaType = Partial<TreinamentoCreateSchemaType> & {
  Id: string;
};
