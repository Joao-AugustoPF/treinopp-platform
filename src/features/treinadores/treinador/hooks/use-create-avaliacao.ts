import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';

import type { AgendaCreateSchemaType } from '../types/agenda';

export const useCreateAvaliacao = () => {
  const { mutate } = useSWRConfig();

  const createAvaliacao = async (data: AgendaCreateSchemaType) => {
    try {
      const response = await toast
        .promise(axios.post(endpoints.treinador.avaliacoes.create(data.TreinadorId), data), {
          loading: 'Criando avaliação...',
          success: 'Avaliação criada com sucesso!',
          error: 'Erro ao criar avaliação',
        })
        .unwrap();

      await mutate(revalidateEndpoint(endpoints.treinador.avaliacoes.list(data.TreinadorId)));

      return response;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  };

  return { createAvaliacao };
};
