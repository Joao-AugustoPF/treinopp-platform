import useSWR from 'swr';

import { JWT_STORAGE_KEY } from 'src/auth/context/jwt';

interface UseListPlansProps {
  limit?: number;
  search?: string;
  tenantId?: string;
}

export function useListPlans({ limit = 100, search = '', tenantId }: UseListPlansProps = {}) {
  const searchParams = new URLSearchParams();
  if (limit) searchParams.append('limit', limit.toString());
  if (search) searchParams.append('search', search);
  if (tenantId) searchParams.append('tenantId', tenantId);

  const query = searchParams.toString();

  const fetcher = async (url: string) => {
    const token = sessionStorage.getItem(JWT_STORAGE_KEY);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ['plans'], revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR(`/api/plans?${query}`, fetcher, {
    keepPreviousData: true,
  });

  console.log('data', data);

  return {
    plans: data?.plans ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
    mutate,
  };
}
