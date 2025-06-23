import type { IPlanTableFilters } from '../hooks/use-plan-filters';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IPlanTableFilters>;
  options?: {
    duracao: {
      value: string;
      label: string;
    }[];
  };
};

export function PlanFiltersResult({ filters, totalResults, sx, options }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveDuracao = useCallback(() => {
    updateFilters({ duracao: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Função para obter o label correto baseado no valor
  const getDuracaoLabel = (value: string) => {
    if (!options?.duracao) return value;
    const option = options.duracao.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const renderDuracao = currentFilters.duracao && (
    <FiltersBlock label="Duração:" isShow={!!currentFilters.duracao}>
      <Chip
        key={currentFilters.duracao}
        label={getDuracaoLabel(currentFilters.duracao)}
        size="small"
        onDelete={handleRemoveDuracao}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={handleRemoveAll} sx={sx}>
      {renderDuracao}
    </FiltersResult>
  );
}
