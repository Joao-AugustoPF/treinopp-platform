import type {
  ITreinador,
  ITreinadorHistorico,
  ITreinadorAvaliacao,
} from 'src/features/treinadores/treinador/types/treinador';

import {
  Sexo,
  Nivel,
  Especialidade,
  StatusTreinador,
} from 'src/features/treinadores/treinador/types/treinador';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _treinadores: ITreinador[] = Array.from({ length: 24 }, (_, index) => {
  // Get a random especialidade value
  const especialidade = Object.values(Especialidade)[index % Object.values(Especialidade).length];

  return {
    Id: _mock.id(index),
    Nome: _mock.fullName(index),
    CreatedAt: new Date(2024, 0, 1).toISOString(),
    CreatedBy: _mock.id(index),
    UpdatedAt: new Date(2024, 0, 1).toISOString(),
    UpdatedBy: _mock.id(index),
    IsDeleted: false,
    FotoPerfil: _mock.image.avatar(index),
    Email: _mock.email(index),
    Telefone: _mock.phoneNumber(index),
    DataNascimento: new Date(1980 + index, 0, 1).toISOString(),
    CPF: _mock.phoneNumber(index),
    Sexo: Object.values(Sexo)[index % Object.values(Sexo).length],
    // Fix: Convert single value to array for Especialidades
    Especialidades: [especialidade],
    // Fix: Use StatusTreinador instead of Status for compatibility with the components
    Status: Object.values(StatusTreinador)[index % Object.values(StatusTreinador).length],
    Especialidade: especialidade, // Keep for backward compatibility
    Nivel: Object.values(Nivel)[index % Object.values(Nivel).length],
    DataContratacao: new Date(2023, 0, 1).toISOString(),
    Salario: 3000 + index * 500,
    Observacao: index % 3 === 0 ? 'Treinador dedicado e comprometido' : null,
    Endereco: {
      Cep: _mock.phoneNumber(index),
      Logradouro: _mock.fullAddress(index),
      Numero: `${Math.floor(Math.random() * 1000)}`,
      Complemento: index % 2 === 0 ? 'Apto 101' : null,
      Bairro: _mock.fullAddress(index),
      Cidade: _mock.fullAddress(index),
      Estado: _mock.fullAddress(index),
    },
  };
});

export const _treinadoresHistory: ITreinadorHistorico[] = Array.from(
  { length: 24 },
  (_, index) => ({
    Id: _mock.id(index),
    Nome: _mock.fullName(index),
    CreatedAt: new Date(2024, 0, 1).toISOString(),
    CreatedBy: _mock.id(index),
    UpdatedAt: new Date(2024, 0, 1).toISOString(),
    UpdatedBy: _mock.id(index),
    IsDeleted: false,
    TreinadorId: _mock.id(index),
    AcademiaId: _mock.id(index),
    DataInicio: new Date(2023, 0, 1).toISOString(),
    DataFim: index % 3 === 0 ? new Date(2024, 0, 1).toISOString() : null,
    Motivo: [
      'Contratação inicial como treinador júnior',
      'Promoção para treinador pleno',
      'Transferência para outra unidade',
      'Afastamento temporário para especialização',
      'Retorno após período de férias',
    ][index % 5],
    Observacao: index % 2 === 0 ? 'Excelente desempenho durante o período' : null,
  })
);

export const _treinadoresAvaliacao: ITreinadorAvaliacao[] = Array.from(
  { length: 24 },
  (_, index) => ({
    Id: _mock.id(index),
    Nome: _mock.fullName(index),
    CreatedAt: new Date(2024, 0, 1).toISOString(),
    CreatedBy: _mock.id(index),
    UpdatedAt: new Date(2024, 0, 1).toISOString(),
    UpdatedBy: _mock.id(index),
    IsDeleted: false,
    TreinadorId: _mock.id(index),
    AlunoId: _mock.id(index),
    DataAvaliacao: new Date(2024, 0, 1).toISOString(),
    Nota: 7 + Math.floor(Math.random() * 3),
    Comentario: [
      'Excelente profissionalismo e conhecimento técnico',
      'Boa comunicação com os alunos',
      'Metodologia de treino eficiente',
      'Pontual e comprometido com os horários',
      'Ótimo acompanhamento do progresso dos alunos',
    ][index % 5],
  })
);
