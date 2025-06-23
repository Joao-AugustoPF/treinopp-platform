import { useSetState } from 'minimal-shared/hooks';

export interface IAulaTableFilters {
  tipoAula: string;
  status: string;
}

const initialState: IAulaTableFilters = {
  tipoAula: '',
  status: '',
};

export const useAulaFilters = () => {
  const filters = useSetState(initialState);

  const hasActiveFilters = () => {
    return filters.state.tipoAula !== '' || filters.state.status !== '';
  };

  return {
    ...filters,
    hasActiveFilters,
  };
}; 