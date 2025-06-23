import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { ITreinamento, TreinamentoCreateSchemaType } from '../types';

export const useCreateTreinamento = () => {
  const { mutate } = useSWRConfig();

  const createTreinamento = async (data: TreinamentoCreateSchemaType) => {
    const response = await axios.post<ITreinamento>(endpoints.treinador.treinamento.list, data);
    await mutate(revalidateEndpoint(endpoints.treinador.treinamento.list));
    return response.data;
  };

  return {
    createTreinamento,
  };
};
