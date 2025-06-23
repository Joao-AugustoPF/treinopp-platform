'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço de email válido!' }),
});

// ----------------------------------------------------------------------

export function JwtResetPasswordView() {
  const router = useRouter();

  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const createRedirectPath = (query: string) => {
    const queryString = new URLSearchParams({ email: query }).toString();
    return `${paths.auth.jwt.updatePassword}?${queryString}`;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await resetPassword({ username: data.email });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const redirectPath = createRedirectPath(data.email);

      router.push(redirectPath);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name="email"
        label="Endereço de email"
        placeholder="exemplo@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Enviando solicitação..."
      >
        Enviar solicitação
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Esqueceu sua senha?"
        description="Por favor, insira o endereço de email associado ao seu conta e enviaremos um link para redefinir sua senha."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
