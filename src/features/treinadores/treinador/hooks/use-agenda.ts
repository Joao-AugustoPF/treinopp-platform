import useSWR, { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IAgenda, AgendaCreateSchemaType, AgendaUpdateSchemaType } from '../types/agenda';

export const useCreateAgenda = () => {
  const { mutate } = useSWRConfig();

  const createAgenda = async (
    data: AgendaCreateSchemaType & {
      custom?: boolean;
      createSlotAndBooking?: boolean;
    }
  ) => {
    console.log('[useCreateAgenda] Creating agenda with data:', data);
    console.log('[useCreateAgenda] Endpoint:', endpoints.treinador.agenda(data.TreinadorId));

    try {
      const response = await axios.post<IAgenda>(
        endpoints.treinador.agenda(data.TreinadorId),
        data
      );
      console.log('[useCreateAgenda] Response:', response.data);

      // Revalida tanto agenda quanto slots de avaliação
      await Promise.all([
        mutate(revalidateEndpoint(endpoints.treinador.agenda(data.TreinadorId))),
        mutate(revalidateEndpoint(endpoints.treinador.avaliacoesSlots(data.TreinadorId))),
      ]);

      return response.data;
    } catch (error) {
      console.error('[useCreateAgenda] Error:', error);
      throw error;
    }
  };

  return {
    createAgenda,
  };
};

export const useUpdateAgenda = () => {
  const { mutate } = useSWRConfig();

  const updateAgenda = async (id: string, data: Omit<AgendaUpdateSchemaType, 'Id'>) => {
    if (!data.TreinadorId) throw new Error('TreinadorId is required');

    console.log('[useUpdateAgenda] Updating agenda:', {
      id,
      data,
      endpoint: `${endpoints.treinador.agenda(data.TreinadorId)}/${id}`,
    });

    try {
      const response = await axios.put<IAgenda>(
        `${endpoints.treinador.agenda(data.TreinadorId)}/${id}`,
        {
          ...data,
          Id: id,
        }
      );
      console.log('[useUpdateAgenda] Response:', response.data);

      // Revalida tanto agenda quanto slots de avaliação
      await Promise.all([
        mutate(revalidateEndpoint(endpoints.treinador.agenda(data.TreinadorId))),
        mutate(revalidateEndpoint(endpoints.treinador.avaliacoesSlots(data.TreinadorId))),
      ]);

      return response.data;
    } catch (error) {
      console.error('[useUpdateAgenda] Error:', error);
      throw error;
    }
  };

  return {
    updateAgenda,
  };
};

export const useDeleteAgenda = () => {
  const { mutate } = useSWRConfig();

  const deleteAgenda = async (
    id: string,
    data: { TreinadorId: string; isBooking?: boolean; bookingId?: string }
  ) => {
    if (!data.TreinadorId) throw new Error('TreinadorId is required');

    console.log('[useDeleteAgenda] Deleting agenda:', {
      id,
      data,
      endpoint: `${endpoints.treinador.agenda(data.TreinadorId)}/${id}`,
    });

    try {
      await axios.delete(`${endpoints.treinador.agenda(data.TreinadorId)}/${id}`, {
        params: {
          isBooking: data.isBooking,
          bookingId: data.bookingId,
        },
      });
      console.log('[useDeleteAgenda] Delete successful');

      // Revalida tanto agenda quanto slots de avaliação
      await Promise.all([
        mutate(revalidateEndpoint(endpoints.treinador.agenda(data.TreinadorId))),
        mutate(revalidateEndpoint(endpoints.treinador.avaliacoesSlots(data.TreinadorId))),
      ]);

      return true;
    } catch (error) {
      console.error('[useDeleteAgenda] Error:', error);
      throw error;
    }
  };

  return {
    deleteAgenda,
  };
};

export const useEvaluationSlots = (treinadorId: string) => {
  const { data, error, mutate } = useSWR(
    treinadorId ? endpoints.treinador.avaliacoesSlots(treinadorId) : null,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    }
  );

  const checkSlotAvailability = async (start: string, end: string) => {
    if (!data?.slots) return false;

    // Verifica se já existe algum booking para este horário
    const hasOverlap = data.slots.some((slot: any) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      const newStart = new Date(start);
      const newEnd = new Date(end);

      return (
        (newStart >= slotStart && newStart < slotEnd) || // Novo evento começa durante um slot existente
        (newEnd > slotStart && newEnd <= slotEnd) || // Novo evento termina durante um slot existente
        (newStart <= slotStart && newEnd >= slotEnd) // Novo evento engloba um slot existente
      );
    });

    return !hasOverlap;
  };

  const createCustomSlot = async (slotData: {
    start: string;
    end: string;
    location: string;
    custom?: boolean;
    memberProfileId?: string;
    observations?: string;
    objectives?: string[];
    restrictions?: string[];
    medicalHistory?: string;
    tenantId?: string;
  }) => {
    try {
      console.log('[useEvaluationSlots] Creating custom slot:', slotData);

      const response = await axios.post(endpoints.treinador.avaliacoesSlots(treinadorId), slotData);

      console.log('[useEvaluationSlots] Custom slot created:', response.data);

      // Atualiza o cache local imediatamente
      await mutate();

      return response.data;
    } catch (error) {
      console.error('[useEvaluationSlots] Error creating custom slot:', error);
      throw error;
    }
  };

  return {
    slots: data?.slots || [],
    isLoading: !error && !data,
    isError: error,
    checkSlotAvailability,
    createCustomSlot,
    mutate,
  };
};
