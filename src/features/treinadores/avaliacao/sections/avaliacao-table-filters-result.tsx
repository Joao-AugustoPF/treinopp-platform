import type { IAvaliacaoTableFilters } from '../types';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { StatusAvaliacao } from '../types';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IAvaliacaoTableFilters>;
};

const getStatusLabel = (status: StatusAvaliacao) => {
  switch (status) {
    case StatusAvaliacao.AGENDADA:
      return 'Agendada';
    case StatusAvaliacao.CANCELADA:
      return 'Cancelada';
    case StatusAvaliacao.REALIZADA:
      return 'Realizada';
    default:
      return status;
  }
};

export function AvaliacaoTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: undefined });
  }, [updateFilters]);

  const handleRemoveDataInicio = useCallback(() => {
    updateFilters({ dataInicio: '' });
  }, [updateFilters]);

  const handleRemoveDataFim = useCallback(() => {
    updateFilters({ dataFim: '' });
  }, [updateFilters]);

  const handleRemoveAll = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderStatus = currentFilters.status && (
    <FiltersBlock label="Status:" isShow={!!currentFilters.status}>
      <Chip
        key={currentFilters.status}
        label={getStatusLabel(currentFilters.status)}
        size="small"
        onDelete={handleRemoveStatus}
        {...chipProps}
      />
    </FiltersBlock>
  );

  const renderDataInicio = currentFilters.dataInicio && (
    <FiltersBlock label="Data Início:" isShow={!!currentFilters.dataInicio}>
      <Chip
        key="dataInicio"
        label={upperFirst(currentFilters.dataInicio)}
        size="small"
        onDelete={handleRemoveDataInicio}
        {...chipProps}
      />
    </FiltersBlock>
  );

  const renderDataFim = currentFilters.dataFim && (
    <FiltersBlock label="Data Fim:" isShow={!!currentFilters.dataFim}>
      <Chip
        key="dataFim"
        label={upperFirst(currentFilters.dataFim)}
        size="small"
        onDelete={handleRemoveDataFim}
        {...chipProps}
      />
    </FiltersBlock>
  );

  return (
    <FiltersResult totalResults={totalResults} sx={sx}>
      {renderStatus}
      {renderDataInicio}
      {renderDataFim}
    </FiltersResult>
  );
}
