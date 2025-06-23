import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export function useDeleteNotificacao() {
  const { mutate } = useSWRConfig();

  const deleteNotificacao = async (id: string) => {
    await axios.delete(endpoints.notificacao.delete(id));
    await mutate(revalidateEndpoint(endpoints.notificacao.list));
  };

  return { deleteNotificacao };
}
