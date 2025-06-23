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
} from '@mui/x-data-grid';

import { Sexo } from '../types';

export const DetentoToolbar = (params: GridToolbarProps) => {
  const api = useGridApiContext();
  const tableFilters = useGridSelector(api, getDefaultGridFilterModel);
  const currentFilters = tableFilters.items.find((item) => item.field === 'Sexo');

  const handleChangeSexo = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      api.current.setFilterModel({
        items: [{ field: 'Sexo', operator: 'is', value: event.target.value }],
      });
    },
    [api]
  );

  return (
    <GridToolbarContainer {...params}>
      <GridToolbarQuickFilter />

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-role-select">Sexo</InputLabel>
        <Select
          value={currentFilters?.value}
          onChange={handleChangeSexo}
          input={<OutlinedInput label="Sexo" />}
          renderValue={(selected) => selected}
          inputProps={{ id: 'filter-role-select' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {Object.values(Sexo).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={currentFilters?.value.includes(option)}
              />
              {option}
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
