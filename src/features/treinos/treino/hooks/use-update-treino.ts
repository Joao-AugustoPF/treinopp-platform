'use client';

import { useState } from 'react';

import axios from 'src/lib/axios';

import type { ITreino } from '../types/treino';

type UpdateTreinoData = Partial<Omit<ITreino, 'Id' | 'DataCriacao' | 'DataAtualizacao'>>;

export function useUpdateTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const updateTreino = async (id: string, data: UpdateTreinoData) => {
    setIsLoading(true);

    try {
      const response = await axios.put<ITreino>(`/api/treinos/${id}`, data);

      return response;
    } catch (error) {
      console.error('Error updating treino:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateTreino,
    isLoading,
  };
}
