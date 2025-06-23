import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import { formatUsersForDisplay } from '../utils/format-user';

import type { IUser } from '../types/user';

export type ListUsersParams = {
  page?: number;
  limit?: number;
  query?: string;
};

export const useListUsers = (params: ListUsersParams = {}) => {
  const { page = 1, limit = 10, query = '' } = params;

  const { data, isLoading, error, mutate } = useSWR<ApiResponse<IUser, 'users'>>(
    [endpoints.users.list, { params: { page, limit, query } }],
    fetcher
  );

  return {
    users: data?.users ? formatUsersForDisplay(data.users) : [],
    isLoading,
    error,
    mutate,
  };
};
