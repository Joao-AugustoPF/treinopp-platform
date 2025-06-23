import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteAvaliacao = (treinadorId: string) => {
  const { mutate } = useSWRConfig();

  const deleteAvaliacao = async (id: string) => {
    await axios.delete(endpoints.treinador.avaliacoes.delete(treinadorId, id));
    await mutate(revalidateEndpoint(endpoints.treinador.avaliacoes.list(treinadorId)));
  };

  return {
    deleteAvaliacao,
  };
};
