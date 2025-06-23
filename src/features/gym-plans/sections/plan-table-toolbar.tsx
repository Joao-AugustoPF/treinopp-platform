import type { IPlanTableFilters } from '../hooks/use-plan-filters';
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

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IPlanTableFilters>;
  options: {
    duracao: {
      value: string;
      label: string;
      min?: number;
      max?: number;
    }[];
  };
};

export function PlanTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeDuracao = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ duracao: value });
    },
    [updateFilters]
  );

  const renderDuracao = (
    <FormControl fullWidth>
      <InputLabel>Duração</InputLabel>

      <Select
        value={currentFilters.duracao}
        onChange={handleChangeDuracao}
        input={<OutlinedInput label="Duração" />}
      >
        <MenuItem value="">
          <em>Todas</em>
        </MenuItem>
        {options.duracao.map((option) => (
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
          {renderDuracao}
        </Stack>
      </Stack>
    </>
  );
}
