import type { IAcademiaTableFilters } from '../hooks/use-academia-filters';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IAcademiaTableFilters>;
  options?: {
    estado: {
      value: string;
      label: string;
    }[];
    cidade: {
      value: string;
      label: string;
    }[];
  };
};

export function AcademiaFiltersResult({ filters, totalResults, sx, options }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveEstado = useCallback(() => {
    updateFilters({ estado: '' });
  }, [updateFilters]);

  const handleRemoveCidade = useCallback(() => {
    updateFilters({ cidade: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Função para obter o label correto baseado no valor
  const getEstadoLabel = (value: string) => {
    if (!options?.estado) return value;
    const option = options.estado.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getCidadeLabel = (value: string) => {
    if (!options?.cidade) return value;
    const option = options.cidade.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const renderEstado = currentFilters.estado && (
    <FiltersBlock label="Estado:" isShow={!!currentFilters.estado}>
      <Chip
        key={currentFilters.estado}
        label={getEstadoLabel(currentFilters.estado)}
        size="small"
        onDelete={handleRemoveEstado}
        {...chipProps}
      />
    </FiltersBlock>
  );

  const renderCidade = currentFilters.cidade && (
    <FiltersBlock label="Cidade:" isShow={!!currentFilters.cidade}>
      <Chip
        key={currentFilters.cidade}
        label={getCidadeLabel(currentFilters.cidade)}
        size="small"
        onDelete={handleRemoveCidade}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={handleRemoveAll} sx={sx}>
      {renderEstado}
      {renderCidade}
    </FiltersResult>
  );
}
