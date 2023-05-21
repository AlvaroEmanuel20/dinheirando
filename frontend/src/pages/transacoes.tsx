import AppFooter from '@/components/shared/AppFooter';
import AppHeader from '@/components/shared/AppHeader';
import TransactionCard from '@/components/shared/TransactionCard';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Select,
  Skeleton,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowsSort,
  IconCalendar,
  IconCoin,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import useTransactions from '@/hooks/useTransactions';
import NoData from '@/components/shared/NoData';
import { Transaction } from '@/lib/apiTypes/transactions';

export default function Transactions() {
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();
  const { data: session } = useSession();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [typeSelect, setTypeSelect] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>('desc');
  const [limit, setLimit] = useState(10);

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = useTransactions<Transaction[]>({ limit, sort: sortBy, type: typeSelect });

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
            Transações
          </Text>
        </Group>
      </AppHeader>

      <Container mt={30}>
        <Card
          bg={colorScheme === 'dark' ? 'gray.7' : 'white'}
          withBorder
          h={180}
        >
          Chart
        </Card>
      </Container>

      <Container mt={20} mb={90}>
        <Text mb={15} weight="bold">
          Suas transações
        </Text>

        <Stack spacing={10}>
          <DatePickerInput
            disabled
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
            placeholder="Filtre por tipo"
            value={typeSelect}
            onChange={setTypeSelect}
            data={[
              { value: 'income', label: 'Ganhos' },
              { value: 'expense', label: 'Gastos' },
            ]}
            icon={<IconCoin size="1rem" />}
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
            placeholder="Ordene por"
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: 'desc', label: 'Mais recentes' },
              { value: 'asc', label: 'Mais antigas' },
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
          {isLoadingTransactions && (
            <div>
              <Skeleton mb={10} height={60} />
              <Skeleton height={60} />
            </div>
          )}

          {transactions &&
            transactions.map((transaction) => (
              <TransactionCard
                key={transaction._id}
                id={transaction._id}
                name={transaction.name}
                date={new Date(transaction.createdAt)}
                value={transaction.value}
                category={transaction.category.name}
                account={transaction.account.name}
                type={transaction.type}
              />
            ))}

          {!isLoadingTransactions && transactions?.length === 0 && (
            <NoData
              link="/adicionar/transacao"
              text="Nenhuma transação encontrada"
            />
          )}
        </Stack>

        {transactions && transactions.length > 8 && (
          <Center mt={20}>
            <Button
              onClick={() => setLimit(limit + 10)}
              variant="subtle"
              color="gray"
            >
              Carregar mais
            </Button>
          </Center>
        )}
      </Container>

      <AppFooter />
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
    props: {},
  };
};
