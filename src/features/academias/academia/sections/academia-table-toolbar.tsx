import type { IAcademiaTableFilters } from '../hooks/use-academia-filters';
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
  filters: UseSetStateReturn<IAcademiaTableFilters>;
  options: {
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

export function AcademiaTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeEstado = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ estado: value });
    },
    [updateFilters]
  );

  const handleChangeCidade = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ cidade: value });
    },
    [updateFilters]
  );

  const renderEstado = (
    <FormControl fullWidth>
      <InputLabel>Estado</InputLabel>

      <Select
        value={currentFilters.estado}
        onChange={handleChangeEstado}
        input={<OutlinedInput label="Estado" />}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {options.estado.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderCidade = (
    <FormControl fullWidth>
      <InputLabel>Cidade</InputLabel>

      <Select
        value={currentFilters.cidade}
        onChange={handleChangeCidade}
        input={<OutlinedInput label="Cidade" />}
      >
        <MenuItem value="">
          <em>Todas</em>
        </MenuItem>
        {options.cidade.map((option) => (
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
          {renderEstado}
          {renderCidade}
        </Stack>
      </Stack>
    </>
  );
}
