import { create } from 'zustand';

import type { ITreino } from '../types';

interface TreinoListViewStore {
  currentTreino: ITreino | null;
  treinoToDelete: ITreino | null;
  setCurrentTreino: (treino: ITreino | null) => void;
  setTreinoToDelete: (treino: ITreino | null) => void;
}

export const useTreinoListViewStore = create<TreinoListViewStore>((set) => ({
  currentTreino: null,
  treinoToDelete: null,
  setCurrentTreino: (treino) => set({ currentTreino: treino }),
  setTreinoToDelete: (treino) => set({ treinoToDelete: treino }),
}));
