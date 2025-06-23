import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IUnidade, IUnidadeTableFilters } from '../types';

type UnidadeListParams = PaginationParams & IUnidadeTableFilters;

export const useListUnidade = (params: UnidadeListParams) => {
  const { page = 1, limit = 10, search = '', Estado = null, Cidade = null } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IUnidade, 'unidades'>>(
    [endpoints.unidade.list, { params: { page, limit, search, Estado, Cidade } }],
    fetcher,
    { keepPreviousData: true }
  );

  return {
    unidades: data?.unidades ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
