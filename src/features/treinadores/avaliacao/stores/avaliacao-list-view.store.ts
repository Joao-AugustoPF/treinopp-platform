import { create } from 'zustand';

import type { IAvaliacao } from '../types';

interface AvaliacaoListViewState {
  currentAvaliacao: IAvaliacao | null;
  avaliacaoToDelete: IAvaliacao | null;
  setCurrentAvaliacao: (avaliacao: IAvaliacao | null) => void;
  setAvaliacaoToDelete: (avaliacao: IAvaliacao | null) => void;
}

export const useAvaliacaoListViewStore = create<AvaliacaoListViewState>((set) => ({
  currentAvaliacao: null,
  avaliacaoToDelete: null,
  setCurrentAvaliacao: (avaliacao) => set({ currentAvaliacao: avaliacao }),
  setAvaliacaoToDelete: (avaliacao) => set({ avaliacaoToDelete: avaliacao }),
}));
