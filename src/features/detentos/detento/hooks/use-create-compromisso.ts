import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';

import type { ICompromisso, ICompromissoInput } from '../types/compromisso';

export const useCreateCompromisso = () => {
  const { mutate } = useSWRConfig();

  const createCompromisso = async (data: ICompromissoInput) => {
    try {
      const response = await toast
        .promise(axios.post<ICompromisso>(endpoints.detento.agenda(data.DetentoId), data), {
          loading: 'Criando compromisso...',
          success: 'Compromisso criado com sucesso!',
          error: 'Erro ao criar compromisso',
        })
        .unwrap();

      await mutate(revalidateEndpoint(endpoints.detento.agenda(data.DetentoId)));

      return response;
    } catch (error) {
      console.error('Erro ao criar compromisso:', error);
      throw error;
    }
  };

  return { createCompromisso };
};
