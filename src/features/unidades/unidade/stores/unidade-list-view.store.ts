import { create } from 'zustand';

import type { IUnidade } from '../types';

type UnidadeListViewStore = {
  currentUnidade: IUnidade | null;
  setCurrentUnidade: (unidade: IUnidade | null) => void;
  unidadeToDelete: IUnidade | null;
  setUnidadeToDelete: (unidade: IUnidade | null) => void;
};

export const useUnidadeListViewStore = create<UnidadeListViewStore>((set) => ({
  currentUnidade: null,
  setCurrentUnidade: (unidade) => set({ currentUnidade: unidade }),
  unidadeToDelete: null,
  setUnidadeToDelete: (unidade) => set({ unidadeToDelete: unidade }),
}));
