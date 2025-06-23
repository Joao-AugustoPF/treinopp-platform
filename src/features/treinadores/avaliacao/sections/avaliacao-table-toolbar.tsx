import type { IAvaliacaoTableFilters } from '../types';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Stack } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { StatusAvaliacao } from '../types';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IAvaliacaoTableFilters>;
  options: {
    status: {
      value: string;
      label: string;
    }[];
  };
};

export function AvaliacaoTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ status: value as StatusAvaliacao });
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
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} alignItems="center">
          {renderStatus}
        </Stack>
      </Stack>
    </>
  );
}
