import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteUnidade = () => {
  const { mutate } = useSWRConfig();

  const deleteUnidade = async (id: string) => {
    await axios.delete(endpoints.unidade.delete(id));
    await mutate(revalidateEndpoint(endpoints.unidade.list));
    await mutate(revalidateEndpoint(endpoints.unidade.details(id)));
  };

  return {
    deleteUnidade,
  };
};
