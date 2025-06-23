export enum Galeria {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum Cela {
  UM = '1',
  DOIS = '2',
  TRES = '3',
  QUATRO = '4',
}

export enum Sexo {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino',
}

export enum Cor {
  BRANCO = 'Branco',
  NEGRO = 'Negro',
  PARDO = 'Pardo',
}

export enum Rosto {
  REDONDO = 'Redondo',
  OVAL = 'Oval',
  QUADRADO = 'Quadrado',
}

export enum CorOlhos {
  CASTANHO = 'Castanho',
  VERDE = 'Verde',
  AZUL = 'Azul',
}

export enum Nariz {
  PEQUENO = 'Pequeno',
  MEDIO = 'Médio',
  GRANDE = 'Grande',
}

export enum Boca {
  PEQUENA = 'Pequena',
  MEDIA = 'Média',
  GRANDE = 'Grande',
}

export enum Dentes {
  BOM = 'Bom',
  REGULAR = 'Regular',
  RUIM = 'Ruim',
}

export enum Cabelos {
  LISO = 'Liso',
  CACHEADO = 'Cachêado',
  CRESPO = 'Crespô',
}

export enum Escolaridade {
  FUNDAMENTAL = 'Fundamental',
  MEDIO = 'Médio',
  SUPERIOR = 'Superior',
  OUTRO = 'Outro',
}

export enum EstadoCivil {
  SOLTEIRO = 'Solteiro',
  CASADO = 'Casado',
  DIVORCIADO = 'Divorciado',
  VIUVO = 'Viúvo',
  OUTRO = 'Outro',
}

export enum Comportamento {
  BOM = 'Bom',
  REGULAR = 'Regular',
  RUIM = 'Ruim',
}

export interface IDetento {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  FotoPerfil: string | null;
  Fotos: string[];
  Galeria: Galeria;
  Cela: Cela;
  CID: string;
  Sexo: Sexo;
  DataNascimento: string;
  Telefone: string;
  Cor: Cor;
  Rosto: Rosto;
  CorOlhos: CorOlhos;
  Nariz: Nariz;
  Boca: Boca;
  Dentes: Dentes;
  Cabelos: Cabelos;
  Altura: string;
  SinaisParticulares: string | null;
  TatuagensQuantidade: string | null;
  TatuagensLocalizacao: string | null;
}

export interface IDetentoSocial {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  DetentoId: string;
  NomeFamiliar: string;
  MatriculaFamiliar: string;
  NomeConjuge: string;
  DataUltimaVisitaSocial: Date | null;
  DataProximaVisitaSocial: Date | null;
  DataUltimaVisitaIntima: Date | null;
  DataProximaVisitaIntima: Date | null;
  RG: string;
  CPF: string;
  NomeMae: string;
  NomePai: string;
  CidadeOrigem: string;
  EstadoOrigem: string;
  PaisOrigem: string;
  Bairro: string;
  Cep: string;
  Logradouro: string;
  Escolaridade: Escolaridade;
  FilhosQuantidade: number;
  EstadoCivil: EstadoCivil;
  Vulgo: string;
  Religiao: string;
  Profissao: string;
}

export interface IDetentoHistorico {
  Id: string;
  Nome: string;
  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  IsDeleted: boolean;
  DetentoId: string;
  UnidadeId: string;
  Historico: string;
  Comportamento: Comportamento;
}

export type DetentoCreateSchemaType = Omit<
  IDetento,
  'Id' | 'CreatedAt' | 'CreatedBy' | 'UpdatedAt' | 'UpdatedBy' | 'IsDeleted'
>;
