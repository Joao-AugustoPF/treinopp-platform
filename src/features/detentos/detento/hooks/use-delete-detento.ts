import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteDetento = () => {
  const { mutate } = useSWRConfig();

  const deleteDetento = async (id: string) => {
    await axios.delete(endpoints.detento.delete(id));
    await mutate(revalidateEndpoint(endpoints.detento.list));
    await mutate(revalidateEndpoint(endpoints.detento.details(id)));
  };

  return {
    deleteDetento,
  };
};
