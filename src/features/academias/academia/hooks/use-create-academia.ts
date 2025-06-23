import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAcademia, AcademiaCreateSchemaType } from '../types';

export const useCreateAcademia = () => {
  const { mutate } = useSWRConfig();

  const createAcademia = async (data: AcademiaCreateSchemaType) => {
    const response = await axios.post<IAcademia>(endpoints.academia.list, data);
    await mutate(revalidateEndpoint(endpoints.academia.list));
    return response.data;
  };

  return {
    createAcademia,
  };
};
