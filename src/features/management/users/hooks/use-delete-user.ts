import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteUser = () => {
  const { mutate } = useSWRConfig();

  const deleteUser = async (id: string) => {
    await axios.delete(endpoints.users.delete(id));
    await mutate(revalidateEndpoint(endpoints.users.list));
  };

  return { deleteUser };
};
