import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IUnidade, UnidadeCreateSchemaType } from '../types';

export const useCreateUnidade = () => {
  const { mutate } = useSWRConfig();

  const createUnidade = async (data: UnidadeCreateSchemaType) => {
    const response = await axios.post<IUnidade>(endpoints.unidade.list, data);
    await mutate(revalidateEndpoint(endpoints.unidade.list));
    return response.data;
  };

  return {
    createUnidade,
  };
};
