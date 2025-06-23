'use client';

import { useState } from 'react';

import axios from 'src/lib/axios';

import type { ITreino } from '../types/treino';

type CreateTreinoData = Omit<ITreino, 'Id' | 'DataCriacao' | 'DataAtualizacao'>;

export function useCreateTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const createTreino = async (data: CreateTreinoData) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ITreino>('/api/treinos', data);

      return response;
    } catch (error) {
      console.error('Error creating treino:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTreino,
    isLoading,
  };
}
