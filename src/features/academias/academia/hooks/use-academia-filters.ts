import { useSetState } from 'minimal-shared/hooks';

export interface IAcademiaTableFilters {
  estado: string;
  cidade: string;
}

const initialState: IAcademiaTableFilters = {
  estado: '',
  cidade: '',
};

export const useAcademiaFilters = () => {
  const filters = useSetState(initialState);

  const hasActiveFilters = () => {
    return filters.state.estado !== '' || filters.state.cidade !== '';
  };

  return {
    ...filters,
    hasActiveFilters,
  };
};
