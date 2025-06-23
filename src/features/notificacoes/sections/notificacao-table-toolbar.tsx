import type { INotificacaoTableFilters } from '../types/notificacao';
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
  filters: UseSetStateReturn<INotificacaoTableFilters>;
  options: {
    tipo: {
      value: string;
      label: string;
    }[];
  };
};

export function NotificacaoTableToolbar({ filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleChangeTipo = useCallback(
    (event: SelectChangeEvent) => {
      const {
        target: { value },
      } = event;

      updateFilters({ tipo: value });
    },
    [updateFilters]
  );

  const renderTipo = (
    <FormControl fullWidth>
      <InputLabel>Tipo</InputLabel>

      <Select
        value={currentFilters.tipo}
        onChange={handleChangeTipo}
        input={<OutlinedInput label="Tipo" />}
      >
        <MenuItem value="">
          <em>Todos</em>
        </MenuItem>
        {options.tipo.map((option) => (
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
          {renderTipo}
        </Stack>
      </Stack>
    </>
  );
}
