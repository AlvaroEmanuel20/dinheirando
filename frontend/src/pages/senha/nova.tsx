import AuthLayout from '@/layouts/AuthLayout';
import { newPasswordSchema } from '@/lib/schemas/auth';
import {
  Container,
  Stack,
  PasswordInput,
  Button,
  Text,
  Loader,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconLock } from '@tabler/icons-react';
import { apiInstance } from '@/lib/apiInstance';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import { GetServerSideProps } from 'next';

interface Arg {
  arg: {
    password: string;
    confirmPassword: string;
    token: string;
  };
}

async function newPassword(url: string, { arg }: Arg) {
  return apiInstance.put(url, arg).then((res) => res.data);
}

export default function NewPassword({ token }: { token: string }) {
  const router = useRouter();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/passwords', newPassword, {
    onSuccess(data, key, config) {
      router.push('/login');
    },
  });

  const form = useForm({
    validate: zodResolver(newPasswordSchema),
    initialValues: {
      password: '',
      confirmPassword: '',
      token,
    },
  });

  return (
    <>
      <AuthLayout title="Redefinir senha">
        <Container size="xs" mt={20}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              try {
                await trigger(values);
              } catch (error) {}
            })}
          >
            <Stack spacing="sm">
              <PasswordInput
                icon={<IconLock size="1rem" />}
                placeholder="Nova senha"
                styles={(theme) => ({
                  input: {
                    '&:focus-within': {
                      borderColor: theme.colors.violet[6],
                    },
                  },
                })}
                {...form.getInputProps('password')}
              />

              <PasswordInput
                icon={<IconLock size="1rem" />}
                placeholder="Confirme a nova senha"
                styles={(theme) => ({
                  input: {
                    '&:focus-within': {
                      borderColor: theme.colors.violet[6],
                    },
                  },
                })}
                {...form.getInputProps('confirmPassword')}
              />

              <Button type="submit" color="violet.6">
                {isMutating ? (
                  <Loader size="xs" variant="dots" color="white" />
                ) : (
                  'Atualizar'
                )}
              </Button>

              {errorMutate && (
                <Text size="sm" color="red">
                  {errorMutate.response.status === 404 &&
                    'Usuário não encontrado'}
                  {errorMutate.response.status === 401 &&
                    'Tempo para recuperar senha expirou, tente novamente.'}
                  {errorMutate.response.status === 500 &&
                    'Erro interno no servidor'}
                </Text>
              )}
            </Stack>
          </form>
        </Container>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.query.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};
