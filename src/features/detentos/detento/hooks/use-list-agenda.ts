import type { ApiResponse } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import { adaptCompromissoToCalendarEvent } from '../utils';

import type { ICompromisso } from '../types/compromisso';

export interface ListCompromissosParams {
  detentoId: string;
  startDate?: string;
  endDate?: string;
}

export const useListAgenda = (params: ListCompromissosParams) => {
  const { detentoId, startDate, endDate } = params;

  const { data, isLoading, error, mutate } = useSWR<ApiResponse<ICompromisso, 'agenda'>, Error>(
    [endpoints.detento.agenda(detentoId), { params: { startDate, endDate } }],
    fetcher
  );

  const calendarEvents = data?.agenda
    ? data.agenda.map((compromisso: ICompromisso) => adaptCompromissoToCalendarEvent(compromisso))
    : [];

  return {
    compromissos: data?.agenda ?? [],
    calendarEvents,
    isLoading,
    error,
    mutate,
  };
};
