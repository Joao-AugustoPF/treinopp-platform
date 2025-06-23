import { create } from 'zustand';

import type { ITreinador, ITreinadorTableFilters } from '../types';

// ----------------------------------------------------------------------

type TreinadorListViewState = {
  // Current selected treinador for editing/viewing
  currentTreinador: ITreinador | null;
  setCurrentTreinador: (treinador: ITreinador | null) => void;

  // Treinador to delete
  treinadorToDelete: ITreinador | null;
  setTreinadorToDelete: (treinador: ITreinador | null) => void;

  // Table filters
  filters: ITreinadorTableFilters;
  setFilters: (filters: Partial<ITreinadorTableFilters>) => void;
  resetFilters: () => void;

  // Pagination
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;

  // Selected items for bulk operations
  selected: string[];
  setSelected: (selected: string[]) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;

  // View modes
  view: 'list' | 'cards';
  setView: (view: 'list' | 'cards') => void;
};

const initialFilters: ITreinadorTableFilters = {
  search: '',
  status: '',
};

export const useTreinadorListViewStore = create<TreinadorListViewState>((set, get) => ({
  // Current treinador
  currentTreinador: null,
  setCurrentTreinador: (treinador) => set({ currentTreinador: treinador }),

  // Treinador to delete
  treinadorToDelete: null,
  setTreinadorToDelete: (treinador) => set({ treinadorToDelete: treinador }),

  // Filters
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 0, // Reset page when filters change
    })),
  resetFilters: () => set({ filters: initialFilters, page: 0 }),

  // Pagination
  page: 0,
  rowsPerPage: 10,
  setPage: (page) => set({ page }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, page: 0 }),

  // Selection
  selected: [],
  setSelected: (selected) => set({ selected }),
  selectAll: (ids) => set({ selected: ids }),
  deselectAll: () => set({ selected: [] }),

  // View
  view: 'list',
  setView: (view) => set({ view }),
}));
