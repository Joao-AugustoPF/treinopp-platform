import type { SelectChangeEvent } from '@mui/material';
import type { GridToolbarProps } from '@mui/x-data-grid';

import { useCallback } from 'react';

import { Select, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';
import {
  useGridSelector,
  GridToolbarExport,
  useGridApiContext,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  getDefaultGridFilterModel,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { Estado, Cidade } from '../types/unidade';

export const UnidadeToolbar = (params: GridToolbarProps) => {
  const api = useGridApiContext();
  const tableFilters = useGridSelector(api, getDefaultGridFilterModel);

  const currentEstado = tableFilters.items.find((item) => item.field === 'Estado')?.value || '';
  const currentCidade = tableFilters.items.find((item) => item.field === 'Cidade')?.value || '';

  const handleChangeEstado = useCallback(
    (event: SelectChangeEvent<string>) => {
      api.current.setFilterModel({
        items: [
          ...tableFilters.items.filter((item) => item.field !== 'Estado'),
          { field: 'Estado', operator: 'is', value: event.target.value },
        ],
      });
    },
    [api, tableFilters.items]
  );

  const handleChangeCidade = useCallback(
    (event: SelectChangeEvent<string>) => {
      api.current.setFilterModel({
        items: [
          ...tableFilters.items.filter((item) => item.field !== 'Cidade'),
          { field: 'Cidade', operator: 'is', value: event.target.value },
        ],
      });
    },
    [api, tableFilters.items]
  );

  return (
    <GridToolbarContainer {...params}>
      <GridToolbarQuickFilter />

      <FormControl sx={{ mx: 1, minWidth: 160 }} size="small">
        <InputLabel>Estado</InputLabel>
        <Select
          value={currentEstado}
          onChange={handleChangeEstado}
          input={<OutlinedInput label="Estado" />}
        >
          {Object.values(Estado).map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ mx: 1, minWidth: 160 }} size="small">
        <InputLabel>Cidade</InputLabel>
        <Select
          value={currentCidade}
          onChange={handleChangeCidade}
          input={<OutlinedInput label="Cidade" />}
        >
          {Object.values(Cidade).map((cidade) => (
            <MenuItem key={cidade} value={cidade}>
              {cidade}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <GridToolbarExport />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};
