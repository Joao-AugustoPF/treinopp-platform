import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { INotificacao } from '../types/notificacao';

export const useNotificacaoById = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR<INotificacao>(
    id ? endpoints.notificacao.details(id) : null,
    fetcher
  );

  return {
    notificacao: data,
    isLoading,
    error,
    mutate,
  };
};
