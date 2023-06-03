import GoogleIcon from '@/components/auth/GoogleIcon';
import TextCustomInput from '@/components/shared/TextCustomInput';
import useAuth from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';
import { signUpSchema } from '@/lib/schemas/auth';
import {
  Container,
  Stack,
  PasswordInput,
  Button,
  Text,
  Loader,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';

export default function SignUp() {
  const { signUpAndRedirect, isLoadingSignUp, errorSignUp } = useAuth();

  const form = useForm({
    validate: zodResolver(signUpSchema),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  return (
    <>
      <AuthLayout
        title="Cadastro"
        auxLink={{
          text: 'Já tem uma conta?',
          textLink: 'Entre',
          link: '/login',
        }}
      >
        <Container size="xs" mt={20}>
          <form onSubmit={form.onSubmit((values) => signUpAndRedirect(values))}>
            <Stack spacing="sm">
              <TextCustomInput
                icon={<IconUser size="0.8rem" />}
                placeholder="Seu nome"
                label="Nome"
                withAsterisk
                {...form.getInputProps('name')}
              />

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
                  {isLoadingSignUp ? (
                    <Loader size="xs" variant="dots" color="white" />
                  ) : (
                    'Criar Conta'
                  )}
                </Button>

                {errorSignUp && (
                  <Text size="sm" color="red">
                    {errorSignUp.message}
                  </Text>
                )}

                <Button
                  fullWidth
                  leftIcon={<GoogleIcon />}
                  variant="default"
                  color="gray"
                >
                  Entrar com Google
                </Button>
              </Stack>
            </Stack>
          </form>
        </Container>
      </AuthLayout>
    </>
  );
}
