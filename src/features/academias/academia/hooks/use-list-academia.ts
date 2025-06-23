import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAcademia } from '../types';

export interface ListAcademiaParams extends PaginationParams {
  search?: string;
  estado?: string;
  cidade?: string;
}

export const useListAcademias = (params: ListAcademiaParams) => {
  const { page = 1, limit = 10, search = '', estado = '', cidade = '' } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IAcademia, 'academias'>>(
    [endpoints.academia.list, { params: { page, limit, search, estado, cidade } }],
    fetcher,
    { keepPreviousData: true }
  );

  return {
    academias: data?.academias ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
