import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAvaliacao } from '../types';

export const useAvaliacaoById = (treinadorId: string, avaliacaoId: string) => {
  const { data, isLoading, error } = useSWR<{ avaliacao: IAvaliacao; metrics: Record<string, number> }>(
    endpoints.treinador.avaliacoes.details(treinadorId, avaliacaoId),
    fetcher
  );

  return {
    avaliacao: data?.avaliacao ?? null,
    metrics: data?.metrics ?? {},
    isLoading,
    error,
  };
};
