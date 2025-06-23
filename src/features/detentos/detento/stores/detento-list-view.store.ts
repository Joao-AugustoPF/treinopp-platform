import { create } from 'zustand';

import type { IDetento } from '../types';

type DetentoListViewStore = {
  currentDetento: IDetento | null;
  setCurrentDetento: (detento: IDetento | null) => void;
  detentoToDelete: IDetento | null;
  setDetentoToDelete: (detento: IDetento | null) => void;
};

export const useDetentoListViewStore = create<DetentoListViewStore>((set) => ({
  currentDetento: null,
  setCurrentDetento: (detento) => set({ currentDetento: detento }),
  detentoToDelete: null,
  setDetentoToDelete: (detento) => set({ detentoToDelete: detento }),
}));
