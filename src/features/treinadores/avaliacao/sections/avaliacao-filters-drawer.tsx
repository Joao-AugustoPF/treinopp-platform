import type { IAvaliacaoTableFilters } from '../types';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { StatusAvaliacao } from '../types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  canReset: boolean;
  filters: UseSetStateReturn<IAvaliacaoTableFilters>;
  options: {
    status: {
      value: string;
      label: string;
    }[];
  };
};

export function AvaliacaoFiltersDrawer({
  open,
  onOpen,
  onClose,
  canReset,
  filters,
  options,
}: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleStatusChange = useCallback(
    (inputValue: string) => {
      updateFilters({ status: inputValue as StatusAvaliacao });
    },
    [updateFilters]
  );

  const handleDataInicioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFilters({ dataInicio: event.target.value });
    },
    [updateFilters]
  );

  const handleDataFimChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFilters({ dataFim: event.target.value });
    },
    [updateFilters]
  );

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderStatus = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Status</Typography>

      <RadioGroup
        value={currentFilters.status || ''}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <FormControlLabel value="" control={<Radio />} label="Todos" />
        {options.status.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  const renderDateRange = (
    <Stack spacing={2}>
      <Typography variant="subtitle2">Período</Typography>

      <TextField
        fullWidth
        label="Data Início"
        type="date"
        value={currentFilters.dataInicio || ''}
        onChange={handleDataInicioChange}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Data Fim"
        type="date"
        value={currentFilters.dataFim || ''}
        onChange={handleDataFimChange}
        InputLabelProps={{ shrink: true }}
      />
    </Stack>
  );

  return (
    <>
      <Tooltip title="Filtros">
        <IconButton onClick={onOpen}>
          <Badge variant="dot" invisible={!canReset} color="error">
            <Iconify icon="mingcute:filter-line" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2.5, borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}
        >
          <Typography variant="h6"> Filtros </Typography>

          <Tooltip title="Limpar">
            <IconButton onClick={handleReset} disabled={!canReset}>
              <Iconify icon="mingcute:refresh-line" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Scrollbar sx={{ p: 2.5 }}>
          <Stack spacing={3}>
            {renderStatus}
            {renderDateRange}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5, borderTop: (theme) => `solid 1px ${theme.palette.divider}` }}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:close-line" />}
            onClick={onClose}
          >
            Fechar
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
