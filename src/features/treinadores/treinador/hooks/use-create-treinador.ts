import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { ITreinador, TreinadorCreateSchemaType } from '../types';

export const useCreateTreinador = () => {
  const { mutate } = useSWRConfig();

  const createTreinador = async (data: TreinadorCreateSchemaType) => {
    const response = await axios.post<ITreinador>(endpoints.treinador.list, data);
    await mutate(revalidateEndpoint(endpoints.treinador.list));
    return response.data;
  };

  return {
    createTreinador,
  };
};
