import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { ITreinador, ITreinadorTableFilters } from '../types';

type TreinadorListParams = PaginationParams & ITreinadorTableFilters;

export const useListTreinadores = (params: TreinadorListParams) => {
  const { page = 1, limit = 10, search = '', status = '' } = params;

  // Filtrar apenas parâmetros que têm valor
  const queryParams: Record<string, any> = { page, limit };

  if (search) queryParams.search = search;
  if (status) queryParams.status = status;

  const { data, isLoading, error, mutate, isValidating, ...rest } = useSWR<
    ApiResponse<ITreinador, 'treinadores'>
  >([endpoints.treinador.list, { params: queryParams }], fetcher, { keepPreviousData: true });

  return {
    treinadores: data?.treinadores ?? [],
    isLoading,
    isValidating,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
