import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAluno } from '../types/aluno';

export const useUpdatePlanAluno = () => {
  const { mutate } = useSWRConfig();

  const updatePlanAluno = async (aluno: IAluno) => {
    const response = await axios.put<IAluno>(endpoints.aluno.plan.update(aluno.Id), aluno);
    await mutate(revalidateEndpoint(endpoints.aluno.details(aluno.Id)));
    await mutate(revalidateEndpoint(endpoints.aluno.list));

    return response.data;
  };

  return {
    updatePlanAluno,
  };
};
