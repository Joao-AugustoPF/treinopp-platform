import { useSWRConfig } from 'swr';

import axios, { endpoints } from 'src/lib/axios';

export const useDeleteCompromisso = () => {
  const { mutate } = useSWRConfig();

  const deleteCompromisso = async (detentoId: string, compromissoId: string) => {
    if (!compromissoId) throw new Error('ID do compromisso é obrigatório');
    if (!detentoId) throw new Error('ID do detento é obrigatório');

    try {
      await axios.delete(`${endpoints.detento.details(detentoId)}/compromissos/${compromissoId}`);

      // Revalidar a lista de compromissos
      await mutate(
        (key) =>
          Array.isArray(key) && key[0] === `${endpoints.detento.details(detentoId)}/compromissos`
      );
    } catch (error) {
      console.error('Erro ao excluir compromisso:', error);
      throw error;
    }
  };

  return { deleteCompromisso };
};
