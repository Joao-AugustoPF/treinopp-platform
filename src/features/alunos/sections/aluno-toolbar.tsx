import type { SelectChangeEvent } from '@mui/material';
import type { GridToolbarProps } from '@mui/x-data-grid';

import { useCallback } from 'react';

import { Select, MenuItem, Checkbox, InputLabel, FormControl, OutlinedInput } from '@mui/material';
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
  getGridSingleSelectOperators,
  gridFilterModelSelector,
} from '@mui/x-data-grid';

import { Status } from '../types/aluno';

const PLANOS = [
  { Id: '1', Nome: 'Plano Básico' },
  { Id: '2', Nome: 'Plano Premium' },
  { Id: '3', Nome: 'Plano VIP' },
];

export const AlunoToolbar = (params: GridToolbarProps) => {
  const api = useGridApiContext();
  const filterModel = useGridSelector(api, gridFilterModelSelector);
  const statusFilter = filterModel.items.find((item) => item.field === 'Status');
  const planoFilter = filterModel.items.find((item) => item.field === 'Plano.Nome');

  // Debug logging
  console.log('=== ALUNO TOOLBAR DEBUG ===');
  console.log('filterModel:', filterModel);
  console.log('statusFilter:', statusFilter);
  console.log('planoFilter:', planoFilter);
  console.log('statusFilter?.value:', statusFilter?.value);
  console.log('planoFilter?.value:', planoFilter?.value);
  console.log('statusFilter?.value type:', typeof statusFilter?.value);
  console.log('planoFilter?.value type:', typeof planoFilter?.value);
  console.log('==========================');

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      console.log('Status change event:', event.target.value);
      const newFilters = filterModel.items.filter((item) => item.field !== 'Status');
      api.current.setFilterModel({
        items: [
          ...newFilters,
          ...(event.target.value.length > 0
            ? [{ field: 'Status', operator: 'is', value: event.target.value }]
            : []),
        ],
      });
    },
    [api, filterModel.items]
  );

  const handleChangePlano = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      console.log('Plano change event:', event.target.value);
      const newFilters = filterModel.items.filter((item) => item.field !== 'Plano.Nome');
      api.current.setFilterModel({
        items: [
          ...newFilters,
          ...(event.target.value.length > 0
            ? [{ field: 'Plano.Nome', operator: 'is', value: event.target.value }]
            : []),
        ],
      });
    },
    [api, filterModel.items]
  );

  return (
    <GridToolbarContainer {...params}>
      <GridToolbarQuickFilter />

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-status-select">Status</InputLabel>
        <Select
          value={statusFilter?.value}
          onChange={handleChangeStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected}
          inputProps={{ id: 'filter-status-select' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {Object.values(Status).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={statusFilter?.value?.includes(option) || false}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-plano-select">Plano</InputLabel>
        <Select
          value={planoFilter?.value}
          onChange={handleChangePlano}
          input={<OutlinedInput label="Plano" />}
          renderValue={(selected) => selected}
          inputProps={{ id: 'filter-plano-select' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {PLANOS.map((plano) => (
            <MenuItem key={plano.Id} value={plano.Nome}>
              <Checkbox
                disableRipple
                size="small"
                checked={planoFilter?.value?.includes(plano.Nome) || false}
              />
              {plano.Nome}
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
