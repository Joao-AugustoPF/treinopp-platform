import { useSetState } from 'minimal-shared/hooks';

import type { ITreinadorTableFilters } from '../types';

const defaultFilters: ITreinadorTableFilters = {
  search: '',
  status: '',
};

export const useTreinadorFilters = () => {
  const filters = useSetState<ITreinadorTableFilters>(defaultFilters);

  const resetFilters = () => {
    filters.resetState();
  };

  const hasActiveFilters = () => {
    const { state } = filters;
    return Boolean(state.search || state.status);
  };

  return {
    ...filters,
    resetFilters,
    hasActiveFilters,
  };
};
