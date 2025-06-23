import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

export const useAcademiaById = (id: string) => {
  const { data, isLoading, error } = useSWR<{ academia: any }>(
    endpoints.academia.details(id),
    fetcher
  );

  return {
    academia: data?.academia ?? null,
    isLoading,
    error,
  };
};
