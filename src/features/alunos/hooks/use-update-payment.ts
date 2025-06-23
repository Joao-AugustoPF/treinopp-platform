import { useSWRConfig } from 'swr';

import { revalidateEndpoint } from 'src/utils/revalidate-endpoint';

import axios, { endpoints } from 'src/lib/axios';

import type { IPaymentHistory } from '../types';

export function useUpdatePayment() {
  const { mutate } = useSWRConfig();

  const addPayment = async (alunoId: string, payment: IPaymentHistory) => {
    const response = await axios.post(endpoints.aluno.payment.add(alunoId), payment);
    await mutate(revalidateEndpoint(endpoints.aluno.payment.list(alunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(alunoId)));
    return response.data;
  };

  const updatePayment = async (alunoId: string, paymentId: string, payment: IPaymentHistory) => {
    const response = await axios.put(endpoints.aluno.payment.update(alunoId, paymentId), payment);
    await mutate(revalidateEndpoint(endpoints.aluno.payment.list(alunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(alunoId)));
    return response.data;
  };

  const deletePayment = async (alunoId: string, paymentId: string) => {
    const response = await axios.delete(endpoints.aluno.payment.delete(alunoId, paymentId));
    await mutate(revalidateEndpoint(endpoints.aluno.payment.list(alunoId)));
    await mutate(revalidateEndpoint(endpoints.aluno.details(alunoId)));
    return response.data;
  };

  return {
    addPayment,
    updatePayment,
    deletePayment,
  };
}
