'use client';

import useSWR from 'swr';

import { fetcher } from 'src/lib/axios';

import type { ITreino } from '../types/treino';

type ListTreinoParams = {
  page: number;
  limit: number;
  search: string;
  TipoTreino: string;
};

type ListTreinoResponse = {
  treinos: ITreino[];
  total: number;
};

export function useListTreino(params: ListTreinoParams) {
  const { page, limit, search, TipoTreino } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(TipoTreino && { TipoTreino }),
  });

  const { data, error, isLoading, isValidating, mutate } = useSWR<ListTreinoResponse>(
    `/api/treinos?${queryParams.toString()}`,
    fetcher
  );

  return {
    treinos: data?.treinos || [],
    total: data?.total || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
