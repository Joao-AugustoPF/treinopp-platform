import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteRole = () => {
  const { mutate } = useSWRConfig();

  const deleteRole = async (id: string) => {
    await axios.delete(endpoints.profiles.delete(id));
    await mutate(revalidateEndpoint(endpoints.profiles.list));
  };

  return { deleteRole };
};
