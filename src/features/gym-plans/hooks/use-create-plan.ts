import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

// import { toast } from 'src/components/toast';
import type { IPlan, ICreatePlanInput } from '../types/plan';

export const useCreatePlan = () => {
  const { mutate } = useSWRConfig();

  const createPlan = async (data: ICreatePlanInput) => {
    try {
      const response = await axios.post<IPlan>(endpoints.plans.create, data);
      await mutate(revalidateEndpoint(endpoints.plans.list));
      return response.data;
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  };

  return { createPlan };
};
