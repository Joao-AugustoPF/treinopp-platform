'use client';

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

import { StatusAvaliacao } from '../types';

export const AvaliacaoToolbar = (props: GridToolbarProps) => {
  const api = useGridApiContext();
  const tableFilters = useGridSelector(api, getDefaultGridFilterModel);
  const currentFilters = tableFilters.items.find((item) => item.field === 'status');

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      api.current.setFilterModel({
        items: [{ field: 'status', operator: 'is', value: event.target.value }],
      });
    },
    [api]
  );

  return (
    <GridToolbarContainer {...props}>
      <GridToolbarQuickFilter />

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-status-select">Status</InputLabel>
        <Select
          value={currentFilters?.value || []}
          onChange={handleChangeStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected}
          inputProps={{ id: 'filter-status-select' }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
        >
          {Object.values(StatusAvaliacao).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                disableRipple
                size="small"
                checked={currentFilters?.value?.includes(option)}
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
