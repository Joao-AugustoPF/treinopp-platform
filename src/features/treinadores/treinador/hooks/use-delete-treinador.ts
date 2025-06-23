import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteTreinador = () => {
  const { mutate } = useSWRConfig();

  const deleteTreinador = async (id: string) => {
    await axios.delete(endpoints.treinador.delete(id));
    await mutate(revalidateEndpoint(endpoints.treinador.list));
    await mutate(revalidateEndpoint(endpoints.treinador.details(id)));
  };

  return {
    deleteTreinador,
  };
};
