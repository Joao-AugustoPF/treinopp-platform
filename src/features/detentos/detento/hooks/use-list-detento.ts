import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IDetento, IDetentoTableFilters } from '../types';

type DetentoListParams = PaginationParams & IDetentoTableFilters;

export const useListDetento = (params: DetentoListParams) => {
  const { page = 1, limit = 10, search = '', Sexo = null } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IDetento, 'detentos'>>(
    [endpoints.detento.list, { params: { page, limit, search, Sexo } }],
    fetcher,
    { keepPreviousData: true }
  );

  return {
    detentos: data?.detentos ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
