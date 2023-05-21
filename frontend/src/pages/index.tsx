import {
  Anchor,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import AppHeader from '@/components/shared/AppHeader';
import Link from 'next/link';
import TotalCard from '@/components/home/TotalCard';
import GoalCard from '@/components/home/GoalCard';
import TransactionCard from '@/components/shared/TransactionCard';
import AppFooter from '@/components/shared/AppFooter';
import useSWR from 'swr';
import { fetcher } from '@/lib/apiInstance';
import { Transaction, TransactionsTotals } from '@/lib/apiTypes/transactions';
import { formatMoney } from '@/lib/formatMoney';
import useTransactions from '@/hooks/useTransactions';
import useUser from '@/hooks/useUser';
import NoData from '@/components/shared/NoData';
import { AccountsTotal } from '@/lib/apiTypes/accounts';
import { notifications } from '@mantine/notifications';

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const { data: session } = useSession();

  const {
    data: totals,
    error: errorTotals,
    isLoading: isLoadingTotals,
  } = useSWR<TransactionsTotals>('/transactions/total', fetcher, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro inesperado',
        message: 'Houve um erro ao carregar os totais de transações',
      });
    },
  });

  const {
    data: accountsTotal,
    error: errorAccountTotal,
    isLoading: isLoadingAccountTotal,
  } = useSWR<AccountsTotal>('/accounts/total', fetcher, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro inesperado',
        message: 'Houve um erro ao carregar o saldo total',
      });
    },
  });

  const {
    data: latestTransactions,
    isLoading: isLoadingLatestTransaction,
    error: errorLatestTransactions,
  } = useTransactions<Transaction[]>({ limit: 5 });

  const { userData, isLoadingUser, errorUser } = useUser();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') signIn();
  }, [session]);

  return (
    <>
      <AppHeader>
        <Stack spacing={1} mt="xl">
          <Skeleton visible={isLoadingAccountTotal} width="40%">
            <Text size="sm" color="white">
              Saldo total:
            </Text>

            <Text size="xl" weight="bold" color="white">
              R${formatMoney.format(accountsTotal ? accountsTotal.total : 0)}
            </Text>
          </Skeleton>
        </Stack>

        <Group grow spacing={20} mt="xl" pb="sm">
          <Skeleton visible={isLoadingTotals}>
            <TotalCard
              value={totals ? totals.totalIncome : 0}
              label="Ganhos totais:"
              bg="green.9"
            />
          </Skeleton>

          <Skeleton visible={isLoadingTotals}>
            <TotalCard
              value={totals ? totals.totalExpense : 0}
              label="Gastos totais:"
              bg="red.9"
            />
          </Skeleton>
        </Group>
      </AppHeader>

      <Container py={20} bg={colorScheme === 'dark' ? 'gray.8' : 'gray.4'}>
        <Group position="apart" mb={15}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} weight="bold">
            Suas metas
          </Text>

          <Anchor
            component={Link}
            href="/metas"
            color={colorScheme === 'dark' ? 'white' : 'dark'}
            size="sm"
          >
            Alterar
          </Anchor>
        </Group>

        <Group grow spacing={20} mt="xl" pb="sm">
          <Skeleton visible={isLoadingUser}>
            <GoalCard
              bg={colorScheme === 'dark' ? 'gray.7' : 'gray.2'}
              label="Meta de ganhos:"
              value={userData ? userData.incomeGoal : 0}
              progress={{
                color: 'green.7',
                value:
                  totals && userData
                    ? (totals.totalIncome / userData.incomeGoal) * 100
                    : 0,
              }}
            />
          </Skeleton>

          <Skeleton visible={isLoadingUser}>
            <GoalCard
              bg={colorScheme === 'dark' ? 'gray.7' : 'gray.2'}
              label="Meta de gastos:"
              value={userData ? userData.expenseGoal : 0}
              progress={{
                color: 'red.7',
                value:
                  totals && userData
                    ? (totals.totalExpense / userData.expenseGoal) * 100
                    : 0,
              }}
            />
          </Skeleton>
        </Group>
      </Container>

      <Container mt={20} mb={90}>
        <Group position="apart" mb={15}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} weight="bold">
            Transações recentes
          </Text>
          <Anchor
            component={Link}
            href="/transacoes"
            color={colorScheme === 'dark' ? 'white' : 'dark'}
            size="sm"
          >
            Ver tudo
          </Anchor>
        </Group>

        <Stack spacing={10}>
          {isLoadingLatestTransaction && (
            <div>
              <Skeleton mb={10} height={60} />
              <Skeleton height={60} />
            </div>
          )}

          {latestTransactions &&
            latestTransactions.map((transaction) => (
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

          {!isLoadingLatestTransaction && latestTransactions?.length === 0 && (
            <NoData
              link="/adicionar/transacao"
              text="Nenhuma transação encontrada"
            />
          )}
        </Stack>
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
