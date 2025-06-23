import type { ITreinador } from 'src/features/treinadores/treinador/types';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

export const useListTreinadores = () => {
  const { data, isLoading, error } = useSWR<{ treinadores: ITreinador[] }>(
    endpoints.treinador.list,
    fetcher
  );

  return {
    treinadores: data?.treinadores ?? [],
    isLoading,
    error,
  };
};
