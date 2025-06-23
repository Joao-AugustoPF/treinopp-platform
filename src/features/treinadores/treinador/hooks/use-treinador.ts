import type { ApiResponse } from 'src/types/api';

import useSWR, { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { fetcher, endpoints } from 'src/lib/axios';

import type { ITreinador, TreinadorCreateSchemaType, TreinadorUpdateSchemaType } from '../types';

// ----------------------------------------------------------------------
// LIST TREINADORES
// ----------------------------------------------------------------------
export const useListTreinadores = (filters?: Record<string, any>) => {
  const { data, error, isLoading, mutate, ...rest } = useSWR<
    ApiResponse<ITreinador, 'treinadores'>,
    Error
  >([endpoints.treinador.list, { params: filters }], fetcher, { keepPreviousData: true });

  return {
    treinadores: data?.treinadores ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};

// ----------------------------------------------------------------------
// GET TREINADOR BY ID
// ----------------------------------------------------------------------
export const useTreinadorById = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ITreinador, 'treinador'>, Error>(
    id ? `${endpoints.treinador.details(id)}` : null,
    fetcher
  );

  return {
    treinador: data?.treinador,
    isLoading,
    error,
    mutate,
  };
};

// ----------------------------------------------------------------------
// CREATE TREINADOR
// ----------------------------------------------------------------------
export const useCreateTreinador = () => {
  const { mutate } = useSWRConfig();

  const createTreinador = async (data: TreinadorCreateSchemaType) => {
    const response = await axios.post<{ message: string; treinador: ITreinador }>(
      endpoints.treinador.list,
      data
    );

    await mutate(revalidateEndpoint(endpoints.treinador.list));

    return response.data.treinador;
  };

  return {
    createTreinador,
  };
};

// ----------------------------------------------------------------------
// UPDATE TREINADOR
// ----------------------------------------------------------------------
export const useUpdateTreinador = () => {
  const { mutate } = useSWRConfig();

  const updateTreinador = async (id: string, data: TreinadorUpdateSchemaType) => {
    const response = await axios.put<{ message: string; treinador: ITreinador }>(
      endpoints.treinador.update(id),
      data
    );

    await mutate(revalidateEndpoint(endpoints.treinador.list));
    await mutate(revalidateEndpoint(endpoints.treinador.details(id)));

    return response.data.treinador;
  };

  return {
    updateTreinador,
  };
};

// ----------------------------------------------------------------------
// DELETE TREINADOR
// ----------------------------------------------------------------------
export const useDeleteTreinador = () => {
  const { mutate } = useSWRConfig();

  const deleteTreinador = async (id: string) => {
    await axios.delete(endpoints.treinador.delete(id));

    await mutate(revalidateEndpoint(endpoints.treinador.list));

    return true;
  };

  return {
    deleteTreinador,
  };
};

// ----------------------------------------------------------------------
// CHECK EMAIL AVAILABILITY (for pre-existing trainer profiles)
// ----------------------------------------------------------------------
export const useCheckTrainerEmail = () => {
  const checkTrainerEmail = async (email: string) => {
    try {
      const response = await axios.get(endpoints.treinador.checkEmail, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking trainer email:', error);
      return { exists: false };
    }
  };

  return {
    checkTrainerEmail,
  };
};
