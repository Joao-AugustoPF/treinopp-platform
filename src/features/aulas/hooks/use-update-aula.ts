import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAula } from '../types';

export const useUpdateAula = () => {
  const { mutate } = useSWRConfig();

  const updateAula = async (id: string, data: any) => {
    const response = await axios.put<IAula>(endpoints.aula.update(id), data);
    await mutate(revalidateEndpoint(endpoints.aula.list));
    await mutate(revalidateEndpoint(endpoints.aula.details(id)));
    return response.data;
  };

  return {
    updateAula,
  };
};
