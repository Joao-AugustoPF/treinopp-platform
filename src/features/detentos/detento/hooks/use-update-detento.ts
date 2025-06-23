import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IDetento, DetentoCreateSchemaType } from '../types';

export const useUpdateDetento = () => {
  const { mutate } = useSWRConfig();

  const updateDetento = async (id: string, data: DetentoCreateSchemaType) => {
    const response = await axios.put<IDetento>(endpoints.detento.update(id), data);

    await mutate(revalidateEndpoint(endpoints.detento.list));
    await mutate(revalidateEndpoint(endpoints.detento.details(id)));

    return response.data;
  };

  return {
    updateDetento,
  };
};
