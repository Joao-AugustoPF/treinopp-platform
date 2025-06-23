import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteAcademia = () => {
  const { mutate } = useSWRConfig();

  const deleteAcademia = async (id: string) => {
    await axios.delete(endpoints.academia.delete(id));
    await mutate(revalidateEndpoint(endpoints.academia.list));
    await mutate(revalidateEndpoint(endpoints.academia.details(id)));
  };

  return {
    deleteAcademia,
  };
};
