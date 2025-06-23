import useSWR from 'swr';
import { useState } from 'react';

import type { ITreino } from '../types';

interface ListTreinoParams {
  page: number;
  limit: number;
  search?: string;
  TipoTreino?: string;
}

interface ListTreinoResponse {
  treinos: ITreino[];
  total: number;
}

export function useListTreino(params: ListTreinoParams) {
  const { data, isLoading, isValidating } = useSWR<ListTreinoResponse>(
    ['/api/treinos', params],
    async () =>
      // TODO: Replace with actual API call
      ({
        treinos: [],
        total: 0,
      })
  );

  return {
    treinos: data?.treinos ?? [],
    total: data?.total ?? 0,
    isLoading,
    isValidating,
  };
}

export function useCreateTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const createTreino = async (data: Omit<ITreino, 'Id' | 'CreatedAt' | 'UpdatedAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Creating treino:', data);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTreino, isLoading };
}

export function useUpdateTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const updateTreino = async (
    id: string,
    data: Partial<Omit<ITreino, 'Id' | 'CreatedAt' | 'UpdatedAt'>>
  ) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Updating treino:', id, data);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTreino, isLoading };
}

export function useDeleteTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTreino = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Deleting treino:', id);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTreino, isLoading };
}
