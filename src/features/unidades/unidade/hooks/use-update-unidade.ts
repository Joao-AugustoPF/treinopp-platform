import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IUnidade, UnidadeCreateSchemaType } from '../types';

export const useUpdateUnidade = () => {
  const { mutate } = useSWRConfig();

  const updateUnidade = async (id: string, data: UnidadeCreateSchemaType) => {
    const response = await axios.put<IUnidade>(endpoints.unidade.update(id), data);

    await mutate(revalidateEndpoint(endpoints.unidade.list));
    await mutate(revalidateEndpoint(endpoints.unidade.details(id)));

    return response.data;
  };

  return {
    updateUnidade,
  };
};
