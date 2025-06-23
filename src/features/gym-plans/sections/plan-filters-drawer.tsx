import type { IPlanTableFilters } from '../hooks/use-plan-filters';
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

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  canReset: boolean;
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

export function PlanFiltersDrawer({ open, onOpen, onClose, canReset, filters, options }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleDuracaoChange = useCallback(
    (inputValue: string) => {
      updateFilters({ duracao: inputValue });
    },
    [updateFilters]
  );

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const renderDuracao = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Duração</Typography>

      <RadioGroup
        value={currentFilters.duracao}
        onChange={(e) => handleDuracaoChange(e.target.value)}
      >
        <FormControlLabel value="" control={<Radio />} label="Todas" />
        {options.duracao.map((option) => (
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
          <Stack spacing={3}>{renderDuracao}</Stack>
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
