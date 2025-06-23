import { create } from 'zustand';

import type { IAula } from '../types';

interface AulaListViewStore {
  currentAula: IAula | null;
  aulaToDelete: IAula | null;
  setCurrentAula: (aula: IAula | null) => void;
  setAulaToDelete: (aula: IAula | null) => void;
}

export const useAulaListViewStore = create<AulaListViewStore>((set) => ({
  currentAula: null,
  aulaToDelete: null,
  setCurrentAula: (aula) => set({ currentAula: aula }),
  setAulaToDelete: (aula) => set({ aulaToDelete: aula }),
}));
