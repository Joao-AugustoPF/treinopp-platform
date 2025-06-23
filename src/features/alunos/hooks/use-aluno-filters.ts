import { useSetState } from 'minimal-shared/hooks';

import type { IAlunoTableFilters } from '../types/aluno';

const defaultFilters: IAlunoTableFilters = {
  search: '',
  status: '',
  tenantId: '',
};

export function useAlunoFilters() {
  const filters = useSetState<IAlunoTableFilters>(defaultFilters);

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
}
