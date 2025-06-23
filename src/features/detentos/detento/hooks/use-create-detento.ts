import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IDetento, DetentoCreateSchemaType } from '../types';

export const useCreateDetento = () => {
  const { mutate } = useSWRConfig();

  const createDetento = async (data: DetentoCreateSchemaType) => {
    const response = await axios.post<IDetento>(endpoints.detento.list, data);
    await mutate(revalidateEndpoint(endpoints.detento.list));
    return response.data;
  };

  return {
    createDetento,
  };
};
