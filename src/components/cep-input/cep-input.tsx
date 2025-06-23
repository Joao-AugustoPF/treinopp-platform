import { useMemo, forwardRef, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from '../iconify';

import type { CepInputProps } from './types';

// ----------------------------------------------------------------------

const formatCEP = (value: string | null) => {
  const cep = value?.replace(/\D/g, '');
  return cep?.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const cleanCEP = (value: string) => value.replace(/\D/g, '');

export const CepInput = forwardRef<HTMLDivElement, CepInputProps>((props, ref) => {
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

  const formattedValue = useMemo(() => formatCEP(value), [value]);

  const handleClear = useCallback(() => {
    onChange?.({ target: { value: '' } });
  }, [onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = cleanCEP(e.target.value);

      if (raw.length <= 8) {
        onChange?.({ target: { value: raw } }); // envia o valor limpo para o formulário
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
      placeholder={placeholder ?? 'Digite o CEP'}
      inputProps={{
        maxLength: 9,
        inputMode: 'numeric',
        pattern: '[0-9]*',
      }}
      InputProps={{
        endAdornment: value && !disableClear && (
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
