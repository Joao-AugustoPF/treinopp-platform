import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export const useDeletePlan = () => {
  const { mutate } = useSWRConfig();

  const deletePlan = async (id: string) => {
    if (!id) throw new Error('ID é obrigatório');

    try {
      await axios.delete(endpoints.plans.delete(id));
      await mutate(revalidateEndpoint(endpoints.plans.list));
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      throw error;
    }
  };

  const deletePlans = async (ids: string[]) => {
    if (!ids.length) throw new Error('Nenhum item selecionado');

    try {
      const promises = ids.map((id) => axios.delete(endpoints.plans.delete(id)));
      await Promise.all(promises);
      await mutate(revalidateEndpoint(endpoints.plans.list));
    } catch (error) {
      console.error('Erro ao excluir planos:', error);
      throw error;
    }
  };

  return { deletePlan, deletePlans };
};
