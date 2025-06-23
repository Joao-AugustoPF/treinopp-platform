import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAvaliacao, AvaliacaoCreateSchemaType } from '../types';

export const useCreateAvaliacao = (treinadorId: string) => {
  const { mutate } = useSWRConfig();

  const createAvaliacao = async (data: AvaliacaoCreateSchemaType) => {
    const response = await axios.post<IAvaliacao>(
      endpoints.treinador.avaliacoes.list(treinadorId),
      data
    );
    await mutate(revalidateEndpoint(endpoints.treinador.avaliacoes.list(treinadorId)));
    return response.data;
  };

  return {
    createAvaliacao,
  };
};
