import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IDetento } from '../types';

export const useDetentoById = (id: string) => {
  const { data, isLoading, error } = useSWR<{ detento: IDetento }>(
    endpoints.detento.details(id),
    fetcher
  );

  return {
    detento: data?.detento ?? null,
    isLoading,
    error,
  };
};
