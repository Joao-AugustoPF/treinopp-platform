import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IPlan } from '../types/plan';

export interface ListPlansParams {
  page: number;
  limit: number;
  search?: string;
  duracao?: string;
  duracaoMin?: number;
  duracaoMax?: number;
}

export const useListPlans = (params: ListPlansParams) => {
  const { page = 1, limit = 10, search = '', duracao = '', duracaoMin, duracaoMax } = params;

  const { data, isLoading, error, mutate } = useSWR<ApiResponse<IPlan, 'plans'>>(
    [
      endpoints.plans.list,
      {
        params: {
          page,
          limit,
          search,
          duracao,
          duracaoMin,
          duracaoMax,
        },
      },
    ],
    fetcher
  );

  return {
    plans: data?.plans ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
};
