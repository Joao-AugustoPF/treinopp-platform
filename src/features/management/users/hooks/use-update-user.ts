import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IUser } from '../types/user';

export type UserUpdateSchemaType = {
  name?: string;
  email?: string;
  roleId?: string;
  active?: boolean;
  password?: string;
  confirmPassword?: string;
};

export const useUpdateUser = () => {
  const { mutate } = useSWRConfig();

  const updateUser = async (id: string, data: UserUpdateSchemaType) => {
    const response = await axios.put<IUser>(endpoints.users.update(id), data);
    await mutate(revalidateEndpoint(endpoints.users.list));
    return response.data;
  };

  return {
    updateUser,
  };
};
