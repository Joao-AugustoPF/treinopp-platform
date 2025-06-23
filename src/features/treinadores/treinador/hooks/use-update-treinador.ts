import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { ITreinador, TreinadorCreateSchemaType } from '../types';

export const useUpdateTreinador = () => {
  const { mutate } = useSWRConfig();

  const updateTreinador = async (id: string, data: TreinadorCreateSchemaType) => {
    const response = await axios.put<ITreinador>(endpoints.treinador.update(id), data);

    await mutate(revalidateEndpoint(endpoints.treinador.list));
    await mutate(revalidateEndpoint(endpoints.treinador.details(id)));

    return response.data;
  };

  return {
    updateTreinador,
  };
};
