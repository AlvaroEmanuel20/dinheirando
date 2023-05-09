import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import ThemeToggle from '@/components/shared/ThemeToggle';
import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  FileInput,
  Group,
  PasswordInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconLanguage,
  IconLock,
  IconMail,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

export default function Preferences() {
  const router = useRouter();

  /*const { signOutAndRedirect, isLoadingSignOut, errorSignOut } = useAuth();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') signIn();
  }, [session]);

  return (
    <>
      Você está logado em {session?.user.email} <br />
      <Button onClick={signOutAndRedirect}>Sign out</Button>
    </>
  );*/

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
        <Group>
          <Avatar src="/profile.jpg" color="yellow.6" size="lg" radius="xl" />
          <Stack spacing={0}>
            <Text size="sm" weight="bold">
              Álvaro Emanuel
            </Text>
            <Text size="sm" color="dimmed">
              alvarodiasribeiro16@gmail.com
            </Text>
          </Stack>
        </Group>
      </Container>

      <Container mt={20}>
        <Text weight="bold">Alterar perfil</Text>

        <Stack spacing="sm" mt={10}>
          <FileInput
            placeholder="Foto de perfil"
            icon={<IconUpload size="0.8rem" />}
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
            defaultValue="Álvaro Emanuel"
          />

          <TextCustomInput
            icon={<IconMail size="0.8rem" />}
            placeholder="Seu email"
            defaultValue="alvarodiasribeiro16@gmail.com"
          />

          <Button color="yellow.6">Salvar</Button>
        </Stack>
      </Container>

      <Container mt={20}>
        <Text weight="bold">Alterar senha</Text>

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
          />

          <TextCustomInput
            type="password"
            icon={<IconLock size="1rem" />}
            placeholder="Confirme a nova senha"
          />

          <Button color="yellow.6">Salvar</Button>
        </Stack>
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
            <Button color="yellow.6">Salvar</Button>
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
  /*const session = await getServerSession(ctx.req, ctx.res, authOptions);

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
  }*/

  return {
    props: {},
  };
};
