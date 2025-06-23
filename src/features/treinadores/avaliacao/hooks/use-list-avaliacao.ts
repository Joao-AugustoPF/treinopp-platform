import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAvaliacao, IAvaliacaoTableFilters } from '../types';

type AvaliacaoListParams = PaginationParams &
  IAvaliacaoTableFilters & {
    treinadorId: string;
  };

export const useListAvaliacoes = (params: AvaliacaoListParams) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = null,
    dataInicio = null,
    dataFim = null,
    treinadorId,
  } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<ApiResponse<IAvaliacao, 'avaliacoes'>>(
    [
      endpoints.treinador.avaliacoes.list(treinadorId),
      { params: { page, limit, search, status, dataInicio, dataFim } },
    ],
    fetcher,
    { keepPreviousData: true }
  );

  return {
    avaliacoes: (data?.avaliacoes ?? []).map((avaliacao) => ({
      ...avaliacao,
      TreinadorId: treinadorId,
    })) ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
