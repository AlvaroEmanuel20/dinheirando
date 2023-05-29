import GoogleIcon from '@/components/auth/GoogleIcon';
import TextCustomInput from '@/components/shared/TextCustomInput';
import AuthLayout from '@/layouts/AuthLayout';
import { loginSchema } from '@/lib/schemas/auth';
import {
  Container,
  Stack,
  PasswordInput,
  Button,
  Text,
  Anchor,
  Loader,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconLock, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import useAuth from '@/hooks/useAuth';

export default function Login() {
  const { signInAndRedirect, isLoadingSignIn, errorSignIn } = useAuth();

  const form = useForm({
    validate: zodResolver(loginSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  return (
    <>
      <AuthLayout
        title="Login"
        auxLink={{
          text: 'Não tem uma conta?',
          textLink: 'Cadastre-se',
          link: '/cadastro',
        }}
      >
        <Container size="xs" mt={20}>
          <form onSubmit={form.onSubmit((values) => signInAndRedirect(values))}>
            <Stack spacing={20}>
              <TextCustomInput
                icon={<IconMail size="0.8rem" />}
                placeholder="exemplo@gmail.com"
                label="Email"
                withAsterisk
                {...form.getInputProps('email')}
              />

              <PasswordInput
                icon={<IconLock size="1rem" />}
                placeholder="Sua senha"
                label="Senha"
                withAsterisk
                styles={(theme) => ({
                  input: {
                    '&:focus-within': {
                      borderColor: theme.colors.violet[6],
                    },
                  },
                })}
                {...form.getInputProps('password')}
              />

              <Stack spacing={10}>
                <Button type="submit" color="violet.6">
                  {isLoadingSignIn ? (
                    <Loader size="xs" variant="dots" color="white" />
                  ) : (
                    'Entrar'
                  )}
                </Button>

                {errorSignIn && (
                  <Text size="sm" color="red">
                    {errorSignIn.message}
                  </Text>
                )}

                <Button
                  fullWidth
                  leftIcon={<GoogleIcon />}
                  variant="default"
                  color="gray"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                  Entrar com Google
                </Button>
              </Stack>
            </Stack>
          </form>

          <Text mt={20} size="sm" color="dimmed">
            Esqueceu a senha?{' '}
            <Anchor
              component={Link}
              weight="bold"
              color="dimmed"
              href="senha/recuperar"
            >
              Recuperar
            </Anchor>
          </Text>
        </Container>
      </AuthLayout>
    </>
  );
}
