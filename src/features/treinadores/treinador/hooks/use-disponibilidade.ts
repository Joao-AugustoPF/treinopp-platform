import useSWR, { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

export type DisponibilidadeCreateSchemaType = {
  start: string;
  end: string;
  location: string;
  tenantId: string;
};

export type DisponibilidadeUpdateSchemaType = DisponibilidadeCreateSchemaType & {
  Id: string;
};

export type Disponibilidade = {
  tenantId: string;
  start: string;
  end: string;
  location: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  trainerProfileId: string;
  $databaseId: string;
  $collectionId: string;
};

export type DisponibilidadeResponse = {
  data: {
    disponibilidades: Disponibilidade[];
    total: number;
  };
};

export const useListDisponibilidade = (treinadorId: string) => {
  const { data, isLoading, error, mutate } = useSWR<DisponibilidadeResponse>(
    endpoints.treinador.disponibilidade(treinadorId),
    axios
  );

  return {
    disponibilidades: data?.data.disponibilidades ?? [],
    total: data?.data.total ?? 0,
    isLoading,
    error,
    mutate,
  };
};

export const useCreateDisponibilidade = () => {
  const { mutate } = useSWRConfig();

  const createDisponibilidade = async (
    treinadorId: string,
    data: DisponibilidadeCreateSchemaType
  ) => {
    const response = await axios.post(`${endpoints.treinador.disponibilidade(treinadorId)}`, data);

    await mutate(revalidateEndpoint(endpoints.treinador.disponibilidade(treinadorId)));

    return response.data;
  };

  return {
    createDisponibilidade,
  };
};

export const useDeleteDisponibilidade = () => {
  const { mutate } = useSWRConfig();

  const deleteDisponibilidade = async (treinadorId: string, disponibilidadeId: string) => {
    await axios.delete(
      `${endpoints.treinador.disponibilidade(treinadorId)}?disponibilidadeId=${disponibilidadeId}`
    );

    await mutate(revalidateEndpoint(endpoints.treinador.disponibilidade(treinadorId)));

    return true;
  };

  return {
    deleteDisponibilidade,
  };
};
