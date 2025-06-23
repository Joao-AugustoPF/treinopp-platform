import { useSetState } from 'minimal-shared/hooks';

import type { IAvaliacaoTableFilters } from '../types';

export const useAvaliacaoFilters = () => {
  const filterState = useSetState<IAvaliacaoTableFilters>({
    search: '',
    status: undefined,
    dataInicio: '',
    dataFim: '',
  });

  const hasActiveFilters = () => {
    const { state } = filterState;
    return !!(state.status || state.dataInicio || state.dataFim);
  };

  return {
    ...filterState,
    hasActiveFilters,
  };
};
