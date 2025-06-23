import { Controller, useFormContext } from 'react-hook-form';

import { CpfInput, type CpfInputProps } from '../cpf-input';

export type RHFCpfInputProps = Omit<CpfInputProps, 'value' | 'onChange'> & {
  name: string;
};

export function RHFCpfInput({ name, helperText, ...other }: RHFCpfInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CpfInput
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message ?? helperText}
          {...other}
        />
      )}
    />
  );
}
