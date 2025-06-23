import type { ITreinadorTableFilters } from '../types';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<ITreinadorTableFilters>;
  options: {
    status: {
      value: string;
      label: string;
    }[];
  };
};

export function TreinadorTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ status: value });
    },
    [updateFilters]
  );

  const renderStatus = (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>

      <Select
        value={currentFilters.status || ''}
        onChange={handleChangeStatus}
        input={<OutlinedInput label="Status" />}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {options.status.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      {renderStatus}
    </Stack>
  );
}
