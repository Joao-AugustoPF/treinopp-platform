import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { INotificacao } from '../types/notificacao';

export const useCreateNotificacao = () => {
  const { mutate } = useSWRConfig();

  const createNotificacao = async (data: any) => {
    const response = await axios.post<INotificacao>(endpoints.notificacao.create, data);
    await mutate(revalidateEndpoint(endpoints.notificacao.list));
    return response.data;
  };

  return {
    createNotificacao,
  };
};
