import { Controller, useFormContext } from 'react-hook-form';

import { CepInput } from '../cep-input';

import type { CepInputProps } from '../cep-input';

// ----------------------------------------------------------------------

export type RHFCepInputProps = Omit<CepInputProps, 'value' | 'onChange'> & {
  name: string;
};

export function RHFCepInput({ name, helperText, ...other }: RHFCepInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CepInput
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
