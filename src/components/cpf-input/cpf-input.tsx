import { useMemo, forwardRef, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from '../iconify';

import type { CpfInputProps } from './types';

// ----------------------------------------------------------------------

const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const cleanCPF = (value: string) => value.replace(/\D/g, '');

export const CpfInput = forwardRef<HTMLDivElement, CpfInputProps>((props, ref) => {
  const {
    sx,
    value = '',
    label,
    onChange,
    placeholder,
    disableClear,
    variant = 'outlined',
    ...other
  } = props;

  const cleanValue = useMemo(() => cleanCPF(value), [value]);
  const formattedValue = useMemo(() => formatCPF(cleanValue), [cleanValue]);

  const handleClear = useCallback(() => {
    onChange?.('');
  }, [onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = cleanCPF(e.target.value);

      if (raw.length <= 11) {
        onChange?.(raw); // valor limpo
      }
    },
    [onChange]
  );

  return (
    <TextField
      ref={ref}
      fullWidth
      label={label}
      value={formattedValue}
      variant={variant}
      onChange={handleChange}
      placeholder={placeholder ?? 'Digite o CPF'}
      inputProps={{
        maxLength: 14,
        inputMode: 'numeric',
        pattern: '[0-9]*',
      }}
      InputProps={{
        endAdornment: cleanValue && !disableClear && (
          <InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={handleClear}>
              <Iconify width={16} icon="mingcute:close-line" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...other}
    />
  );
});
