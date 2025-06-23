import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { INotificacao, INotificacaoTableFilters } from '../types/notificacao';
import { PaginationParams } from 'src/types/api';

type NotificacaoListParams = PaginationParams & INotificacaoTableFilters;

export const useListNotificacoes = (params: NotificacaoListParams) => {
  const { page = 1, limit = 10, search = '', tipo = '' } = params;

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    [
      endpoints.notificacao.list,
      {
        params: {
          page,
          limit,
          search,
          tipo,
        },
      },
    ],
    fetcher
  );

  return {
    notificacoes: data?.notificacoes ?? [],
    total: data?.total ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};
