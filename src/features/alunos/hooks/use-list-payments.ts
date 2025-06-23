import type { ApiResponse, PaginationParams } from 'src/types/api';

import useSWR from 'swr';

import { fetcher, endpoints } from 'src/lib/axios';

import type { IPaymentHistory } from '../types';

type PaymentListParams = PaginationParams & {
  alunoId: string;
};

export const useListPayments = (params: PaymentListParams) => {
  const { page = 1, limit = 10, alunoId } = params;

  const { data, isLoading, error, mutate, ...rest } = useSWR<
    ApiResponse<IPaymentHistory, 'payments'>
  >([endpoints.aluno.payment.list(alunoId), { params: { page, limit } }], fetcher, {
    keepPreviousData: true,
  });

  return {
    payments: data?.payments ?? [],
    isLoading,
    error,
    total: data?.total ?? 0,
    mutate,
    ...rest,
  };
};
