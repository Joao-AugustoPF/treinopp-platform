import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export function useDeleteAula() {
  const { mutate } = useSWRConfig();

  const deleteAula = async (id: string) => {
    await axios.delete(endpoints.aula.delete(id));
    await mutate(revalidateEndpoint(endpoints.aula.list));
  };

  return { deleteAula };
}
