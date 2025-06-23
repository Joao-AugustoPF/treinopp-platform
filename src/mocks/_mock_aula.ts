import { TipoAula } from 'src/features/aulas/types';

// ----------------------------------------------------------------------

const MOCK_AULAS = [
  {
    Id: '1',
    Nome: 'Yoga Relaxante',
    TipoAula: TipoAula.YOGA,
    TreinadorId: 'TR001',
    DataInicio: '2024-03-20T08:00:00Z',
    DataFim: '2024-03-20T09:00:00Z',
    Local: 'Sala 1',
    CapacidadeMaxima: 20,
    VagasDisponiveis: 15,
    Status: 'Agendada',
    CreatedAt: '2024-03-15T10:00:00Z',
    CreatedBy: 'ADMIN001',
    UpdatedAt: '2024-03-15T10:00:00Z',
    UpdatedBy: 'ADMIN001',
    IsDeleted: false,
  },
  {
    Id: '2',
    Nome: 'Funcional Intenso',
    TipoAula: TipoAula.FUNCIONAL,
    TreinadorId: 'TR002',
    DataInicio: '2024-03-20T10:00:00Z',
    DataFim: '2024-03-20T11:00:00Z',
    Local: 'Sala 2',
    CapacidadeMaxima: 15,
    VagasDisponiveis: 8,
    Status: 'Agendada',
    CreatedAt: '2024-03-15T10:00:00Z',
    CreatedBy: 'ADMIN001',
    UpdatedAt: '2024-03-15T10:00:00Z',
    UpdatedBy: 'ADMIN001',
    IsDeleted: false,
  },
  {
    Id: '3',
    Nome: 'Yoga Avançado',
    TipoAula: TipoAula.YOGA,
    TreinadorId: 'TR003',
    DataInicio: '2024-03-20T14:00:00Z',
    DataFim: '2024-03-20T15:00:00Z',
    Local: 'Sala Principal',
    CapacidadeMaxima: 30,
    VagasDisponiveis: 12,
    Status: 'Agendada',
    CreatedAt: '2024-03-15T10:00:00Z',
    CreatedBy: 'ADMIN001',
    UpdatedAt: '2024-03-15T10:00:00Z',
    UpdatedBy: 'ADMIN001',
    IsDeleted: false,
  },
  {
    Id: '4',
    Nome: 'Funcional Cardio',
    TipoAula: TipoAula.FUNCIONAL,
    TreinadorId: 'TR004',
    DataInicio: '2024-03-20T16:00:00Z',
    DataFim: '2024-03-20T17:00:00Z',
    Local: 'Sala 3',
    CapacidadeMaxima: 12,
    VagasDisponiveis: 5,
    Status: 'Agendada',
    CreatedAt: '2024-03-15T10:00:00Z',
    CreatedBy: 'ADMIN001',
    UpdatedAt: '2024-03-15T10:00:00Z',
    UpdatedBy: 'ADMIN001',
    IsDeleted: false,
  },
  {
    Id: '5',
    Nome: 'Outro Treino',
    TipoAula: TipoAula.OUTRO,
    TreinadorId: 'TR005',
    DataInicio: '2024-03-20T18:00:00Z',
    DataFim: '2024-03-20T19:00:00Z',
    Local: 'Box CrossFit',
    CapacidadeMaxima: 15,
    VagasDisponiveis: 3,
    Status: 'Agendada',
    CreatedAt: '2024-03-15T10:00:00Z',
    CreatedBy: 'ADMIN001',
    UpdatedAt: '2024-03-15T10:00:00Z',
    UpdatedBy: 'ADMIN001',
    IsDeleted: false,
  },
];

export const mockAulas = MOCK_AULAS;

export const mockAula = MOCK_AULAS[0];

// ----------------------------------------------------------------------

export const mockAulaTableFilters = {
  name: '',
  TipoAula: '',
  DataInicio: null,
  DataFim: null,
};
