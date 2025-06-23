import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IUser } from '../types/user';

export type UserCreateSchemaType = {
  name: string;
  email: string;
  roleId?: string;
  password: string;
  confirmPassword: string;
};

export const useCreateUser = () => {
  const { mutate } = useSWRConfig();

  const createUser = async (data: UserCreateSchemaType) => {
    const response = await axios.post<IUser>(endpoints.users.list, data);
    await mutate(revalidateEndpoint(endpoints.users.list));
    return response.data;
  };

  return {
    createUser,
  };
};
