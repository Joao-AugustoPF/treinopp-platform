'use client';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean, useCountdownSeconds } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { FormResendCode } from '../../components/form-resend-code';

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = zod
  .object({
    code: zod
      .string()
      .min(1, { message: 'Código é obrigatório!' })
      .min(6, { message: 'Código deve conter pelo menos 6 caracteres!' }),
    email: zod
      .string()
      .min(1, { message: 'Email é obrigatório!' })
      .email({ message: 'Email deve ser um endereço de email válido!' }),
    password: zod
      .string()
      .min(1, { message: 'Senha é obrigatória!' })
      .min(6, { message: 'Senha deve conter pelo menos 6 caracteres!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirmar senha é obrigatório!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function JwtUpdatePasswordView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const showPassword = useBoolean();

  const countdown = useCountdownSeconds(5);

  const defaultValues: UpdatePasswordSchemaType = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      router.push(paths.auth.amplify.signIn);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    if (!countdown.isCounting) {
      try {
        countdown.reset();
        countdown.start();
      } catch (error) {
        console.error(error);
      }
    }
  }, [countdown, values.email]);

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Endereço de email"
        placeholder="exemplo@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
        disabled
      />

      <Field.Code name="code" />

      <Field.Text
        name="password"
        label="Senha"
        placeholder="6+ caracteres"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirmar nova senha"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Atualizando senha..."
      >
        Atualizar senha
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Solicitação enviada com sucesso!"
        description={`Enviamos um email de 6 dígitos de confirmação para o seu email. \nPor favor, insira o código no campo abaixo para verificar seu email.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode
        onResendCode={handleResendCode}
        value={countdown.value}
        disabled={countdown.isCounting}
      />

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
