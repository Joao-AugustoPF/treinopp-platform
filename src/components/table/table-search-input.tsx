import type { TextFieldProps } from '@mui/material';

import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';

import { Iconify } from '../iconify';

type Props = TextFieldProps;

export function TableSearchInput({ ...props }: Props) {
  return (
    <TextField
      fullWidth
      placeholder="Pesquisar..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
