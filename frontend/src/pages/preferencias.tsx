import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import ThemeToggle from '@/components/shared/ThemeToggle';
import {
  ActionIcon,
  Alert,
  Avatar,
  Button,
  Container,
  FileInput,
  Group,
  Loader,
  PasswordInput,
  Select,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconLanguage,
  IconLock,
  IconMail,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import useUser from '@/hooks/useUser';
import { useForm, zodResolver } from '@mantine/form';
import { updatePasswordSchema, updateUserSchema } from '@/lib/schemas/users';
import { UserId } from '@/lib/apiTypes/users';
import useSWRMutation from 'swr/mutation';
import { updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface Arg {
  arg: {
    name: string;
    email: string;
  };
}

interface ArgPassword {
  arg: {
    password: string;
    confirmPassword: string;
  };
}

interface PreferencesProps {
  userForm: {
    name: string;
    email: string;
  };
}

export default function Preferences({ userForm }: PreferencesProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [emailWasUpdated, setEmailWasUpdated] = useState(false);

  const { mutate } = useSWRConfig();

  const {
    trigger: triggerUpdateUser,
    isMutating: isMutatingUser,
    error: errorMutateUser,
  } = useSWRMutation('/users', updateService<UserId, Arg>);

  const {
    trigger: triggerUpdatePassword,
    isMutating: isMutatingPassword,
    error: errorMutatePassword,
  } = useSWRMutation('/users', updateService<UserId, ArgPassword>);

  const { userData, isLoadingUser, errorUser } = useUser();

  const form = useForm({
    validate: zodResolver(updateUserSchema),
    initialValues: {
      name: userForm.name,
      email: userForm.email,
    },
  });

  const formPassword = useForm({
    validate: zodResolver(updatePasswordSchema),
    initialValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') signIn();
  }, [session]);

  return (
    <>
      <AppHeader>
        <Group mt="xl">
          <ActionIcon
            onClick={() => router.back()}
            variant="filled"
            color="yellow.6"
          >
            <IconArrowLeft size="1.1rem" />
          </ActionIcon>

          <Text size="lg" weight="bold" color="white">
            Preferências
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20}>
        <Skeleton visible={isLoadingUser}>
          <Group>
            <Avatar
              src={userData?.avatar ? userData.avatar : null}
              color="yellow.6"
              size="lg"
              radius="xl"
            />

            <Stack spacing={0}>
              <Text size="sm" weight="bold">
                {userData?.name}
              </Text>
              <Text size="sm" color="dimmed">
                {userData?.email}
              </Text>
            </Stack>
          </Group>
        </Skeleton>
      </Container>

      {userData && !userData.isVerified && (
        <Container mt={15}>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Aviso"
            color="yellow"
            variant="outline"
          >
            Seu email ainda não foi verificado. Verifique o email enviado por
            nós com as instruções para verificar seu email.
            <Button compact mt={8} color="yellow.6">
              Reenviar email
            </Button>
          </Alert>
        </Container>
      )}

      <Container mt={20}>
        <Text weight="bold">Alterar perfil</Text>

        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              await triggerUpdateUser(values);

              await mutate(
                (key) => typeof key === 'string' && key.startsWith('/users')
              );

              if (values.email.length > 0) setEmailWasUpdated(true);
            } catch (error) {}
          })}
        >
          <Stack spacing="sm" mt={10}>
            <FileInput
              placeholder="Foto de perfil"
              icon={<IconUpload size="0.8rem" />}
              accept="image/png,image/jpeg,image/jpg"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.yellow[5],
                  },
                },
              })}
            />

            <TextCustomInput
              icon={<IconUser size="0.8rem" />}
              placeholder="Seu nome"
              {...form.getInputProps('name')}
            />

            <TextCustomInput
              icon={<IconMail size="0.8rem" />}
              placeholder="Seu email"
              {...form.getInputProps('email')}
            />

            <Button type="submit" color="yellow.6">
              {isMutatingUser ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Alterar'
              )}
            </Button>

            {errorMutateUser && (
              <Text size="sm" color="red">
                {errorMutateUser.response.status === 409
                  ? 'Já existe uma conta com esse email'
                  : 'Error interno no servidor'}
              </Text>
            )}

            {!errorMutateUser && emailWasUpdated && (
              <Text size="sm" color="green">
                Enviamos um email de confirmação para você
              </Text>
            )}
          </Stack>
        </form>
      </Container>

      <Container mt={20}>
        <Text weight="bold">Alterar senha</Text>

        <form
          onSubmit={formPassword.onSubmit(async (values) => {
            try {
              await triggerUpdatePassword(values);
            } catch (error) {}
          })}
        >
          <Stack spacing="sm" mt={10}>
            <PasswordInput
              icon={<IconLock size="1rem" />}
              placeholder="Nova senha"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.yellow[5],
                  },
                },
              })}
              {...formPassword.getInputProps('password')}
            />

            <PasswordInput
              icon={<IconLock size="1rem" />}
              placeholder="Confirme a nova senha"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.yellow[5],
                  },
                },
              })}
              {...formPassword.getInputProps('confirmPassword')}
            />

            <Button type="submit" color="yellow.6">
              {isMutatingPassword ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Alterar'
              )}
            </Button>

            {errorMutatePassword && (
              <Text size="sm" color="red">
                Error interno no servidor
              </Text>
            )}
          </Stack>
        </form>
      </Container>

      <Container mt={20} mb={50}>
        <Text weight="bold">Suas preferências</Text>

        <Stack spacing="sm" mt={10}>
          <Group position="apart">
            <Text>Idioma</Text>
            <Select
              clearable
              placeholder="Idioma"
              data={[
                { value: 'pt', label: 'Português' },
                { value: 'en', label: 'Inglês' },
              ]}
              icon={<IconLanguage size="1rem" />}
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.yellow[5],
                  },
                },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor:
                        theme.colorScheme === 'dark'
                          ? theme.colors.gray[8]
                          : theme.colors.gray[2],
                      color:
                        theme.colorScheme === 'dark'
                          ? theme.white
                          : theme.colors.dark,
                    },
                  },
                },
              })}
            />
          </Group>

          <Group position="apart">
            <Text>Tema</Text>
            <ThemeToggle />
          </Group>

          <Group grow spacing={10} mt={10}>
            <Button disabled color="yellow.6">
              Salvar
            </Button>
            <Button variant="subtle" color="red">
              Excluir conta
            </Button>
          </Group>
        </Stack>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.error === 'RefreshAccessTokenError') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userForm: {
        name: session.user.name,
        email: session.user.email,
      },
    },
  };
};
