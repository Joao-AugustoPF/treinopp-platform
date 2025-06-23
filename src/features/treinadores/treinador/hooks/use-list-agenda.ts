import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import { adaptAgendaToCalendarEvent } from '../utils';

import type { IAgenda } from '../types/agenda';

export interface ListAgendaParams {
  treinadorId: string;
  startDate?: string;
  endDate?: string;
}

export const useListAgenda = (params: ListAgendaParams) => {
  const { treinadorId, startDate, endDate } = params;

  const { data, isLoading, error, mutate } = useSWR<ApiResponse<IAgenda, 'agenda'>, Error>(
    [endpoints.treinador.agenda(treinadorId), { params: { startDate, endDate } }],
    fetcher
  );

  const calendarEvents = data?.agenda
    ? data.agenda.map((agenda: any) => {
        const event = adaptAgendaToCalendarEvent(agenda);
        // Ensure student data is properly included
        if (agenda.AlunoId) {
          return {
            ...event,
            alunoId: agenda.AlunoId,
            extendedProps: {
              alunoId: agenda.AlunoId,
              aluno: agenda.Aluno as any,
            },
          };
        }
        return event;
      })
    : [];

  return {
    agenda: data?.agenda ?? [],
    calendarEvents,
    isLoading,
    error,
    mutate,
  };
};
