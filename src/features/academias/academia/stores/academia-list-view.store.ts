import { create } from 'zustand';

import type { IAcademia } from '../types';

type AcademiaListViewStore = {
  currentAcademia: IAcademia | null;
  setCurrentAcademia: (academia: IAcademia | null) => void;
  academiaToDelete: IAcademia | null;
  setAcademiaToDelete: (academia: IAcademia | null) => void;
  selectedAcademia: IAcademia | null;
  setSelectedAcademia: (academia: IAcademia | null) => void;
};

export const useAcademiaListViewStore = create<AcademiaListViewStore>((set) => ({
  currentAcademia: null,
  setCurrentAcademia: (academia) => set({ currentAcademia: academia }),
  academiaToDelete: null,
  setAcademiaToDelete: (academia) => set({ academiaToDelete: academia }),
  selectedAcademia: null,
  setSelectedAcademia: (academia) => set({ selectedAcademia: academia }),
}));
