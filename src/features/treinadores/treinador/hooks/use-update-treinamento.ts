import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { ITreinamento, TreinamentoUpdateSchemaType } from '../types';

export const useUpdateTreinamento = () => {
  const { mutate } = useSWRConfig();

  const updateTreinamento = async (data: TreinamentoUpdateSchemaType) => {
    const response = await axios.put<ITreinamento>(
      `${endpoints.treinador.treinamento.list}/${data.Id}`,
      data
    );
    await mutate(revalidateEndpoint(endpoints.treinador.treinamento.list));
    return response.data;
  };

  return {
    updateTreinamento,
  };
};
