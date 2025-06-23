import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAcademia, IAcademiaFilters } from '../types';

type AcademiaListParams = PaginationParams & IAcademiaFilters;

export const useListUserAcademia = (params: AcademiaListParams) => {
  const { page = 1, limit = 10, search = '', Cidade = '', Estado = '' } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IAcademia, 'academias'>>(
    [endpoints.academia.me, { params: { page, limit, search, Cidade, Estado } }],
    fetcher,
    { keepPreviousData: true }
  );

  console.log(data);

  return {
    academia: data?.academias ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
