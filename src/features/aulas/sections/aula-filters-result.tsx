import type { IAulaTableFilters } from '../hooks/use-aula-filters';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IAulaTableFilters>;
  options?: {
    tipoAula: {
      value: string;
      label: string;
    }[];
    status: {
      value: string;
      label: string;
    }[];
  };
};

export function AulaFiltersResult({ filters, totalResults, sx, options }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveTipoAula = useCallback(() => {
    updateFilters({ tipoAula: '' });
  }, [updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Função para obter o label correto baseado no valor
  const getTipoAulaLabel = (value: string) => {
    if (!options?.tipoAula) return value;
    const option = options.tipoAula.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getStatusLabel = (value: string) => {
    if (!options?.status) return value;
    const option = options.status.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const renderTipoAula = currentFilters.tipoAula && (
    <FiltersBlock isShow={!!currentFilters.tipoAula} label="Tipo de Aula:">
      <Chip
        key={currentFilters.tipoAula}
        label={getTipoAulaLabel(currentFilters.tipoAula)}
        size="small"
        onDelete={handleRemoveTipoAula}
        {...chipProps}
      />
    </FiltersBlock>
  );

  const renderStatus = currentFilters.status && (
    <FiltersBlock isShow={!!currentFilters.status} label="Status:">
      <Chip
        key={currentFilters.status}
        label={getStatusLabel(currentFilters.status)}
        size="small"
        onDelete={handleRemoveStatus}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} sx={sx}>
      {renderTipoAula}
      {renderStatus}
    </FiltersResult>
  );
}
