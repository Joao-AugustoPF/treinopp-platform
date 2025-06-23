import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAluno, IAlunoTableFilters } from '../types/aluno';
import { PaginationParams } from 'src/types/api';

type AlunoListParams = PaginationParams & IAlunoTableFilters;

export const useListAlunos = (params: AlunoListParams) => {
  const { page = 1, limit = 10, search = '', status = '', tenantId = '' } = params;

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    [endpoints.aluno.list, { params: { page, limit, search, status, tenantId } }],
    fetcher
  );

  return {
    alunos: data?.alunos ?? [],
    total: data?.total ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
