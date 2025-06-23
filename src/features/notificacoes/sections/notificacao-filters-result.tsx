import type { INotificacaoTableFilters } from '../types/notificacao';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<INotificacaoTableFilters>;
  options?: {
    tipo: {
      value: string;
      label: string;
    }[];
  };
};

export function NotificacaoFiltersResult({ filters, totalResults, sx, options }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveTipo = useCallback(() => {
    updateFilters({ tipo: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderTipo = currentFilters.tipo && (
    <FiltersBlock label="Tipo:" isShow={!!currentFilters.tipo}>
      <Chip
        key={currentFilters.tipo}
        label={options?.tipo.find((option) => option.value === currentFilters.tipo)?.label || currentFilters.tipo}
        size="small"
        onDelete={handleRemoveTipo}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} sx={sx}>
      {renderTipo}
    </FiltersResult>
  );
}
