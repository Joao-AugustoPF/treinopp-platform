import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type CepInputProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  disableClear?: boolean;
};
