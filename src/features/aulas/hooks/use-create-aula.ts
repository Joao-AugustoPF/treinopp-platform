import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAula } from '../types';

export const useCreateAula = () => {
  const { mutate } = useSWRConfig();

  const createAula = async (data: any) => {
    const response = await axios.post<IAula>(endpoints.aula.create, data);
    await mutate(revalidateEndpoint(endpoints.aula.list));
    return response.data;
  };

  return {
    createAula,
  };
};
