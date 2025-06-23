import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IPlan, IUpdatePlanInput } from '../types/plan';

export const useUpdatePlan = () => {
  const { mutate } = useSWRConfig();

  const updatePlan = async (id: string, data: IUpdatePlanInput) => {
    if (!id) throw new Error('ID é obrigatório');

    try {
      const response = await axios.put<IPlan>(endpoints.plans.update(id), data);
      await Promise.all([
        mutate(revalidateEndpoint(endpoints.plans.list)),
        mutate(revalidateEndpoint(endpoints.plans.details(id))),
      ]);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      throw error;
    }
  };

  return { updatePlan };
};
