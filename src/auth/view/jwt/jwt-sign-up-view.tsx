'use client';

import { z as zod } from 'zod';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useEmailCheck } from 'src/features/treinadores/treinador/hooks';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  // Hook otimizado para check de email
  const { trainerInfo, checkingEmail, checkEmail, clearCache } = useEmailCheck(800);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const emailValue = watch('email');

  // Validação de email mais robusta
  const isValidEmail = useMemo(() => {
    if (!emailValue || emailValue.length < 5) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  }, [emailValue]);

  // Check email quando mudar
  useEffect(() => {
    if (emailValue) {
      checkEmail(emailValue);
    }
  }, [emailValue, checkEmail]);

  // Limpar cache quando componente desmontar
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, [clearCache]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderTrainerInfo = () => {
    // Não mostrar nada se o email não for válido
    if (!isValidEmail) {
      return null;
    }

    if (checkingEmail) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          Verificando email...
        </Alert>
      );
    }

    if (trainerInfo?.exists && trainerInfo?.isTrainer) {
      return (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Ótimo! Você foi pré-cadastrado como treinador.</strong>
          </Typography>
          <Typography variant="body2">
            Ao completar o registro, você terá acesso ao painel do treinador com todas as
            funcionalidades necessárias para gerenciar suas atividades.
          </Typography>
        </Alert>
      );
    }

    if (trainerInfo?.exists && !trainerInfo?.isTrainer) {
      return (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Este email já está cadastrado no sistema com outro tipo de perfil.
        </Alert>
      );
    }

    return null;
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="lastName"
          label="Last name"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text name="email" label="Email address" slotProps={{ inputLabel: { shrink: true } }} />

      {renderTrainerInfo()}

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
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
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Create account..."
      >
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Get started absolutely free"
        description={
          <>
            {`Already have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
