import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAula } from '../types';

export interface ListAulaParams extends PaginationParams {
  search?: string;
  tipoAula?: string;
  status?: string;
}

export const useListAula = (params: ListAulaParams) => {
  const { page = 1, limit = 10, search = '', tipoAula = '', status = '' } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IAula, 'aulas'>>(
    [endpoints.aula.list, { params: { page, limit, search, tipoAula, status } }],
    fetcher,
    { keepPreviousData: true }
  );

  return {
    aulas: data?.aulas ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
