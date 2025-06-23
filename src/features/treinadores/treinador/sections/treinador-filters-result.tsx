import type { ITreinadorTableFilters } from '../types';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<ITreinadorTableFilters>;
};

export function TreinadorFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderStatus = currentFilters.status && (
    <FiltersBlock label="Status:" isShow={!!currentFilters.status}>
      <Chip
        key={currentFilters.status}
        label={currentFilters.status}
        size="small"
        onDelete={handleRemoveStatus}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={handleRemoveAll} sx={sx}>
      {renderStatus}
    </FiltersResult>
  );
}
