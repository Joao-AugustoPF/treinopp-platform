import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAvaliacao, AvaliacaoCreateSchemaType } from '../types';

export const useUpdateAvaliacao = (treinadorId: string) => {
  const { mutate } = useSWRConfig();

  const updateAvaliacao = async (id: string, data: AvaliacaoCreateSchemaType) => {
    const response = await axios.put<IAvaliacao>(
      endpoints.treinador.avaliacoes.update(treinadorId, id),
      data
    );

    await mutate(revalidateEndpoint(endpoints.treinador.avaliacoes.list(treinadorId)));
    // await mutate(revalidateEndpoint(endpoints.treinador.avaliacoes.details(treinadorId, id)));

    return response.data;
  };

  return {
    updateAvaliacao,
  };
};
