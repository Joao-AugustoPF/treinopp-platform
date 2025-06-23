import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';

export const useDeleteAluno = () => {
  const { mutate } = useSWRConfig();

  const deleteAluno = async (id: string) => {
    if (!id) throw new Error('ID é obrigatório');

    try {
      await toast.promise(axios.delete(endpoints.aluno.delete(id)), {
        loading: 'Excluindo aluno...',
        success: 'Aluno excluído com sucesso!',
        error: 'Erro ao excluir aluno',
      });

      await mutate(revalidateEndpoint(endpoints.aluno.list));
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      throw error;
    }
  };

  const deleteAlunos = async (ids: string[]) => {
    if (!ids.length) throw new Error('Nenhum item selecionado');

    try {
      const promises = ids.map((id) => axios.delete(endpoints.aluno.delete(id)));

      await toast.promise(Promise.all(promises), {
        loading: 'Excluindo alunos...',
        success: 'Alunos excluídos com sucesso!',
        error: 'Erro ao excluir alunos',
      });

      await mutate(revalidateEndpoint(endpoints.aluno.list));
    } catch (error) {
      console.error('Erro ao excluir alunos:', error);
      throw error;
    }
  };

  return { deleteAluno, deleteAlunos };
};
