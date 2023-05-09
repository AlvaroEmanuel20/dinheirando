import AppFooter from '@/components/shared/AppFooter';
import AppHeader from '@/components/shared/AppHeader';
import AccountCard from '@/components/wallet/AccountCard';
import TransferCard from '@/components/wallet/TransferCard';
import {
  ActionIcon,
  Container,
  Divider,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowsSort,
  IconCalendar,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Wallet() {
  const router = useRouter();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [sortBy, setSortBy] = useState<string | null>('latest');

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
            Carteira
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20}>
        <Text mb={15} weight="bold">
          Suas contas
        </Text>

        <Stack spacing={10}>
          <AccountCard name="Banco do Brasil" amount={1500} />
          <AccountCard name="Inter" amount={250} />
          <AccountCard name="Neon" amount={50.9} />
        </Stack>
      </Container>

      <Container mt={20} mb={90}>
        <Text mb={15} weight="bold">
          Suas transferências
        </Text>

        <Stack spacing={10}>
          <DatePickerInput
            clearable
            icon={<IconCalendar size="1rem" />}
            valueFormat="DD/MM/YYYY"
            type="range"
            placeholder="Filtre por data"
            value={dateRange}
            onChange={setDateRange}
            labelSeparator="até"
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

          <Select
            clearable
            placeholder="Ordene por"
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: 'latest', label: 'Mais recentes' },
              { value: 'oldest', label: 'Mais antigas' },
            ]}
            icon={<IconArrowsSort size="1rem" />}
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
        </Stack>

        <Divider my={15} />

        <Stack spacing={10}>
          <TransferCard
            fromAccount="Banco do Brasil"
            toAccount="Neon"
            value={25.9}
            date={new Date(2023, 4, 9)}
          />

          <TransferCard
            fromAccount="Inter"
            toAccount="Neon"
            value={89}
            date={new Date(2023, 4, 9)}
          />

          <TransferCard
            fromAccount="Neon"
            toAccount="Banco do Brasil"
            value={389.9}
            date={new Date(2023, 4, 9)}
          />
        </Stack>
      </Container>

      <AppFooter />
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
