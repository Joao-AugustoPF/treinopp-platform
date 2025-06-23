import { useSetState } from 'minimal-shared/hooks';

import type { INotificacaoTableFilters } from '../types/notificacao';

const defaultFilters: INotificacaoTableFilters = {
  search: '',
  tipo: '',
};

export function useNotificacaoFilters() {
  const filters = useSetState<INotificacaoTableFilters>(defaultFilters);

  const resetFilters = () => {
    filters.resetState();
  };

  const hasActiveFilters = () => {
    const { state } = filters;
    return Boolean(state.search || state.tipo);
  };

  return {
    ...filters,
    resetFilters,
    hasActiveFilters,
  };
}
