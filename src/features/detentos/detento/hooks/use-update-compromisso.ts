import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';

import type { ICompromisso, ICompromissoUpdateInput } from '../types/compromisso';

export const useUpdateCompromisso = () => {
  const { mutate } = useSWRConfig();

  const updateCompromisso = async (data: ICompromissoUpdateInput) => {
    if (!data.Id) throw new Error('ID é obrigatório');
    if (!data.DetentoId) throw new Error('ID do detento é obrigatório');

    try {
      const response = await toast
        .promise(
          axios.put<ICompromisso>(`${endpoints.detento.agenda(data.DetentoId)}/${data.Id}`, data),
          {
            loading: 'Atualizando compromisso...',
            success: 'Compromisso atualizado com sucesso!',
            error: 'Erro ao atualizar compromisso',
          }
        )
        .unwrap();

      // Revalidar a lista de compromissos
      await mutate(revalidateEndpoint(endpoints.detento.agenda(data.DetentoId)));

      return response;
    } catch (error) {
      console.error('Erro ao atualizar compromisso:', error);
      throw error;
    }
  };

  return { updateCompromisso };
};
