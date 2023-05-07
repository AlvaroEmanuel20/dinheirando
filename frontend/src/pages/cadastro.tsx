import GoogleIcon from '@/components/auth/GoogleIcon';
import TextCustomInput from '@/components/shared/TextCustomInput';
import useAuth from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';
import { signUpSchema } from '@/lib/schemas/auth';
import {
  Container,
  Stack,
  Title,
  PasswordInput,
  Button,
  Center,
  Text,
  Loader,
  Anchor,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

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
      <AuthLayout>
        <Container mt={30}>
          <Title order={1} size="1.5rem" mb={15}>
            Cadastro
          </Title>

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
                      borderColor: theme.colors.yellow[5],
                    },
                  },
                })}
                {...form.getInputProps('password')}
              />

              <Button type="submit" color="yellow.6">
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
            </Stack>
          </form>

          <Center my={15}>
            <Text size="sm" color="dimmed">
              Ou entre com
            </Text>
          </Center>

          <Button
            fullWidth
            leftIcon={<GoogleIcon />}
            variant="default"
            color="gray"
          >
            Google
          </Button>

          <Text mt={15} size="sm" color="dimmed">
            Já tem uma conta?{' '}
            <Anchor component={Link} weight="bold" color="dimmed" href="/">
              Entre
            </Anchor>
          </Text>
        </Container>
      </AuthLayout>
    </>
  );
}
