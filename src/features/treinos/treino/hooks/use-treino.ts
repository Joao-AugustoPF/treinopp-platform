import useSWR, { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { ITreino } from '../types';
import type { ITreinoFormValues } from '../sections/treino-form';

export const useCreateTreino = () => {
  const { mutate } = useSWRConfig();

  const createTreino = async (data: ITreinoFormValues) => {
    const response = await axios.post<ITreino>(endpoints.treino.create, data);
    await mutate(revalidateEndpoint(endpoints.treino.list));
    return response.data;
  };

  return { createTreino };
};

export const useUpdateTreino = () => {
  const { mutate } = useSWRConfig();

  const updateTreino = async (data: ITreinoFormValues & { Id: string }) => {
    const response = await axios.put<ITreino>(endpoints.treino.update(data.Id), data);
    await mutate(revalidateEndpoint(endpoints.treino.list));
    await mutate(revalidateEndpoint(endpoints.treino.details(data.Id)));
    return response.data;
  };

  return { updateTreino };
};

export const useListTreinos = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  alunoId?: string;
  treinadorId?: string;
}) => {
  const { data, error, isLoading, mutate } = useSWR<{
    treinos: ITreino[];
    total: number;
  }>(endpoints.treino.list, axios);

  return {
    treinos: data?.treinos ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
};

export const useTreino = (id: string) => {
  const { data, error, isLoading } = useSWR<{ treino: ITreino }>(
    id ? endpoints.treino.details(id) : null,
    axios
  );

  return {
    treino: data?.treino,
    isLoading,
    error,
  };
};
