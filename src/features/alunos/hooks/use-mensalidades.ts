import { useSWRConfig } from 'swr';
import useSWR from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { fetcher, endpoints } from 'src/lib/axios';

import type { IMensalidade, IMensalidadeCreate, IMensalidadeUpdate } from '../types/mensalidade';

// Hook para listar mensalidades de um aluno
export const useListMensalidades = (alunoId: string) => {
  const { data, isLoading, error, mutate } = useSWR(
    alunoId ? endpoints.aluno.mensalidades.list(alunoId) : null,
    fetcher
  );

  return {
    mensalidades: data?.mensalidades || [],
    isLoading,
    error,
    mutate,
  };
};

// Hook para criar mensalidade
export const useCreateMensalidade = () => {
  const { mutate } = useSWRConfig();

  const createMensalidade = async (data: IMensalidadeCreate) => {
    const response = await axios.post(endpoints.aluno.mensalidades.create(data.AlunoId), data);
    
    // Revalidar dados relacionados
    await mutate(revalidateEndpoint(endpoints.aluno.mensalidades.list(data.AlunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(data.AlunoId)));
    
    return response.data;
  };

  return { createMensalidade };
};

// Hook para atualizar mensalidade
export const useUpdateMensalidade = () => {
  const { mutate } = useSWRConfig();

  const updateMensalidade = async (mensalidadeId: string, data: IMensalidadeUpdate & { AlunoId: string }) => {
    const response = await axios.put(endpoints.aluno.mensalidades.update(data.AlunoId, mensalidadeId), data);
    
    // Revalidar dados relacionados
    await mutate(revalidateEndpoint(endpoints.aluno.mensalidades.list(data.AlunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(data.AlunoId)));
    
    return response.data;
  };

  return { updateMensalidade };
};

// Hook para deletar mensalidade
export const useDeleteMensalidade = () => {
  const { mutate } = useSWRConfig();

  const deleteMensalidade = async (mensalidadeId: string, alunoId: string) => {
    const response = await axios.delete(endpoints.aluno.mensalidades.delete(alunoId, mensalidadeId));
    
    // Revalidar dados relacionados
    await mutate(revalidateEndpoint(endpoints.aluno.mensalidades.list(alunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(alunoId)));
    
    return response.data;
  };

  return { deleteMensalidade };
};

// Hook para gerar mensalidades automaticamente
export const useGenerateMensalidades = () => {
  const { mutate } = useSWRConfig();

  const generateMensalidades = async (alunoId: string, meses: number) => {
    const response = await axios.post(endpoints.aluno.mensalidades.generate, {
      alunoId,
      meses,
    });
    
    await mutate(revalidateEndpoint(endpoints.aluno.mensalidades.list(alunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(alunoId)));
    
    return response.data;
  };

  return { generateMensalidades };
}; 