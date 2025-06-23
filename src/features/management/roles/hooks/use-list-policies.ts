import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IPolicy } from '../types';

export const useListPolicies = () => {
  const { data, isLoading } = useSWR<ApiResponse<IPolicy, 'policies'>>(
    endpoints.policies.list,
    fetcher
  );
  const policies = data?.policies;
  return { policies, isLoading };
};
