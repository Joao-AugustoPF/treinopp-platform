import type { IUnidade } from 'src/features/unidades/unidade/types';

import { _mock } from './_mock';

export const _unidades: IUnidade[] = Array.from({ length: 10 }, (_, index) => ({
  Id: _mock.id(index),
  Nome: `Unidade ${index + 1}`,
  CreatedAt: new Date(2024, 0, 1).toISOString(),
  CreatedBy: _mock.id(index),
  UpdatedAt: new Date(2024, 0, 1).toISOString(),
  UpdatedBy: _mock.id(index),
  IsDeleted: false,
  NomeExibicao: `Penitenciária ${index + 1}`,
  Email: `unidade${index + 1}@exemplo.com`,
  Logradouro: _mock.fullAddress(index),
  Cep: _mock.zipCode(index),
  Cidade: _mock.city(index),
  Estado: _mock.state(index),
  LogradouroNumero: `${index + 100}`,
  Telefone: _mock.phoneNumber(index),
  SiglaUnidade: `U${index + 1}`,
}));
