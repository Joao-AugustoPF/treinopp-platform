import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IRole } from '../types';

export type ListRolesParams = {
  page?: number;
  limit?: number;
  query?: string;
};

export const useListRoles = (params: ListRolesParams = {}) => {
  const { page = 1, limit = 10, query = '' } = params;

  const { data, isLoading, error, mutate } = useSWR<ApiResponse<IRole, 'roles'>>(
    [endpoints.profiles.list, { params: { page, limit, query } }],
    fetcher
  );

  return {
    roles: data?.roles ?? [],
    isLoading,
    error,
    mutate,
  };
};
