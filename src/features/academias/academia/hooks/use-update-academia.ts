import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAcademia, AcademiaCreateSchemaType } from '../types';

export const useUpdateAcademia = () => {
  const { mutate } = useSWRConfig();

  const updateAcademia = async (id: string, data: AcademiaCreateSchemaType) => {
    const response = await axios.put<IAcademia>(endpoints.academia.update(id), data);

    await mutate(revalidateEndpoint(endpoints.academia.list));
    await mutate(revalidateEndpoint(endpoints.academia.details(id)));

    return response.data;
  };

  return {
    updateAcademia,
  };
};
