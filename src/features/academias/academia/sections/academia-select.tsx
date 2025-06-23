'use client';

import type { SelectChangeEvent } from '@mui/material';

import { useState } from 'react';

import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useListAcademias } from '../hooks/use-list-academia';
import { useAcademiaListViewStore } from '../stores/academia-list-view.store';

export function AcademiaSelect() {
  const [page] = useState(0);
  const [rowsPerPage] = useState(100);
  const { setSelectedAcademia } = useAcademiaListViewStore();

  const { academias, isLoading } = useListAcademias({
    page,
    search: '',
    limit: rowsPerPage,
  });


  const handleChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const academia = academias?.find((a: any) => a.$id === selectedId);
    if (academia) {
      setSelectedAcademia(academia);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!academias?.length) {
    return <Typography sx={{ textAlign: 'center', my: 4 }}>Nenhuma academia encontrada</Typography>;
  }

  return (
    <Box sx={{ minWidth: 300, maxWidth: 600, mx: 'auto', my: 4 }}>
      <FormControl fullWidth>
        <InputLabel id="academia-select-label">Selecione uma academia</InputLabel>
        <Select
          labelId="academia-select-label"
          id="academia-select"
          label="Selecione uma academia"
          onChange={handleChange}
        >
          {academias.map((academia: any) => (
            <MenuItem key={academia.$id} value={academia.$id}>
              {academia.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
