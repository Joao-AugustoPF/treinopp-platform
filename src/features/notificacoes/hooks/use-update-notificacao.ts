import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { INotificacao } from '../types/notificacao';

export const useUpdateNotificacao = () => {
  const { mutate } = useSWRConfig();

  const updateNotificacao = async (id: string, data: any) => {
    const response = await axios.put<INotificacao>(endpoints.notificacao.update(id), data);
    await mutate(revalidateEndpoint(endpoints.notificacao.list));
    await mutate(revalidateEndpoint(endpoints.notificacao.details(id)));
    return response.data;
  };

  return {
    updateNotificacao,
  };
};
