import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IUnidade } from '../types';

export const useUnidadeById = (id: string) => {
  const { data, isLoading, error } = useSWR<{ unidade: IUnidade }>(
    endpoints.unidade.details(id),
    fetcher
  );

  return {
    unidade: data?.unidade ?? null,
    isLoading,
    error,
  };
};
