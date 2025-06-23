import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IAluno } from '../types/aluno';

export const useAlunoById = (id: string) => {
  const { data, isLoading, error } = useSWR<{ aluno: IAluno }>(
    endpoints.aluno.details(id),
    fetcher
  );

  return {
    aluno: data?.aluno ?? null,
    isLoading,
    error,
  };
};
