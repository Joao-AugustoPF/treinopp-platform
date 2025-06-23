import type { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------
export type CpfInputProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  disableClear?: boolean;
};
