import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IRole } from '../types/role';
import type { RoleCreateSchemaType } from '../sections/role-form';

export const useUpdateRole = () => {
  const { mutate } = useSWRConfig();

  const updateRole = async (id: string, data: RoleCreateSchemaType) => {
    const response = await axios.put<IRole>(endpoints.profiles.update(id), data);
    await mutate(revalidateEndpoint(endpoints.profiles.list));
    return response.data;
  };

  return {
    updateRole,
  };
};
