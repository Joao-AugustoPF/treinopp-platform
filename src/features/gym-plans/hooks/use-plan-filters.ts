import { useSetState } from 'minimal-shared/hooks';

export interface IPlanTableFilters {
  duracao: string;
}

const initialState: IPlanTableFilters = {
  duracao: '',
};

export const usePlanFilters = () => {
  const filters = useSetState(initialState);

  const hasActiveFilters = () => {
    return filters.state.duracao !== '';
  };

  // Função para obter o range de duração baseado no valor selecionado
  const getDuracaoRange = (duracaoValue: string) => {
    switch (duracaoValue) {
      case '30':
        return { min: 1, max: 30 };
      case '60':
        return { min: 31, max: 60 };
      case '90':
        return { min: 61, max: 90 };
      case '180':
        return { min: 91, max: 180 };
      case '365':
        return { min: 181, max: 365 };
      default:
        return null;
    }
  };

  return {
    ...filters,
    hasActiveFilters,
    getDuracaoRange,
  };
};
