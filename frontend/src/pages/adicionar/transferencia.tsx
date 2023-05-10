import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconCalendar,
  IconCurrencyReal,
  IconEdit,
  IconTags,
  IconWallet,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

export default function AddTransfer() {
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
            Adicionar transferência
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20} mb={50}>
        <Stack spacing={10}>
          <Select
            clearable
            withAsterisk
            label="Conta de origem"
            placeholder="Selecione a conta de origem"
            data={['Banco do Brasil', 'Neon', 'Inter']}
            icon={<IconWallet size="1rem" />}
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

          <Select
            clearable
            withAsterisk
            label="Conta de destino"
            placeholder="Selecione a conta destino"
            data={['Banco do Brasil', 'Inter', 'Neon']}
            icon={<IconWallet size="1rem" />}
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

          <DatePickerInput
            withAsterisk
            label="Data"
            placeholder="09/05/2023"
            clearable
            icon={<IconCalendar size="1rem" />}
            valueFormat="DD/MM/YYYY"
            weekdayFormat="ddd"
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.yellow[5],
                },
              },
              day: {
                '&[data-selected]': {
                  backgroundColor: theme.colors.yellow[5],
                },
              },
            })}
          />

          <NumberInput
            withAsterisk
            decimalSeparator=","
            thousandsSeparator="."
            label="Valor"
            placeholder="500,00"
            precision={2}
            step={0.5}
            icon={<IconCurrencyReal size="1rem" />}
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.yellow[5],
                },
              },
            })}
          />

          <Button color="yellow.6">Adicionar</Button>
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
