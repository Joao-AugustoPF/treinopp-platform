import type { IPlanTableFilters } from '../hooks/use-plan-filters';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IPlanTableFilters>;
};

export function PlanTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveDuracao = useCallback(() => {
    updateFilters({ duracao: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderDuracao = currentFilters.duracao && (
    <FiltersBlock label="Duração:" isShow={!!currentFilters.duracao}>
      <Chip
        key={currentFilters.duracao}
        label={upperFirst(currentFilters.duracao)}
        size="small"
        onDelete={handleRemoveDuracao}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} sx={sx}>
      {renderDuracao}
    </FiltersResult>
  );
}
