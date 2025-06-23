'use client';

import { useState } from 'react';

import axios from 'src/lib/axios';

export function useDeleteTreino() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTreino = async (id: string) => {
    setIsLoading(true);

    try {
      await axios.delete(`/api/treinos/${id}`);

      return true;
    } catch (error) {
      console.error('Error deleting treino:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTreino,
    isLoading,
  };
}
