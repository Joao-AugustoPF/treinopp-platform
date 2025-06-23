import type { IAulaTableFilters } from '../hooks/use-aula-filters';
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
  filters: UseSetStateReturn<IAulaTableFilters>;
  options: {
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

export function AulaTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeTipoAula = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ tipoAula: value });
    },
    [updateFilters]
  );

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ status: value });
    },
    [updateFilters]
  );

  const renderTipoAula = (
    <FormControl fullWidth>
      <InputLabel>Tipo de Aula</InputLabel>

      <Select
        value={currentFilters.tipoAula}
        onChange={handleChangeTipoAula}
        input={<OutlinedInput label="Tipo de Aula" />}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {options.tipoAula.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderStatus = (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>

      <Select
        value={currentFilters.status}
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
          {renderTipoAula}
          {renderStatus}
        </Stack>
      </Stack>
    </>
  );
}
