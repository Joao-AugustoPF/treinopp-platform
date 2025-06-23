import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IRole } from '../types/role';
import type { RoleCreateSchemaType } from '../sections/role-form';

export const useCreateRole = () => {
  const { mutate } = useSWRConfig();

  const createRole = async (data: RoleCreateSchemaType) => {
    const response = await axios.post<IRole>(endpoints.profiles.list, data);
    await mutate(revalidateEndpoint(endpoints.profiles.list));
    return response.data;
  };

  return {
    createRole,
  };
};
