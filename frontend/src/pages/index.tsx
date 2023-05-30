import {
  ActionIcon,
  Box,
  Container,
  Group,
  MediaQuery,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AppHeader from '@/components/home/AppHeader';
import TotalCard from '@/components/home/TotalCard';
import TransactionCard from '@/components/home/TransactionCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/apiInstance';
import { Transaction, TransactionsTotals } from '@/lib/apiTypes/transactions';
import useTransactions from '@/hooks/useTransactions';
import useUser from '@/hooks/useUser';
import { AccountsTotal } from '@/lib/apiTypes/accounts';
import { notifications } from '@mantine/notifications';
import {
  IconCalendarSearch,
  IconCirclePlus,
  IconMinus,
  IconPlus,
  IconSortDescending2,
} from '@tabler/icons-react';
import useAuth from '@/hooks/useAuth';
import WalletCard from '@/components/home/WalletCard';
import CategoryCard from '@/components/home/CategoryCard';
import NewItemCard from '@/components/home/NewItemCard';
import ListTransactionsTransfersMenu from '@/components/home/ListTransactionsTransfersMenu';
import TransferCard from '@/components/home/TransferCard';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import { Carousel } from '@mantine/carousel';

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const { data: session } = useSession();
  const { signOutAndRedirect } = useAuth();

  const { classes } = useStylesHome();
  const [categoriesChecked, setCategoriesChecked] = useState(true);
  const [menuSelected, setMenuSelected] = useState<
    'transactions' | 'transfers'
  >('transactions');

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
    <Box mih="100vh" bg={colorScheme === 'dark' ? 'dark.7' : 'violet.6'}>
      <Group
        className={classes.mainGroup}
        noWrap
        position="apart"
        grow
        align="strecth"
        spacing={50}
      >
        <Container className={classes.leftContainer} my={50} p={0} pl={50}>
          <AppHeader />

          <SimpleGrid
            className={classes.gridVerticalSpace}
            mt={40}
            spacing={20}
            cols={3}
            breakpoints={[
              { maxWidth: 'lgg', cols: 2 },
              { maxWidth: 'md', cols: 3, spacing: 10 },
              { maxWidth: 'lxs', cols: 2, spacing: 10 },
            ]}
          >
            <TotalCard label="Saldo total" value={75000} />
            <TotalCard label="Ganhos totais" value={20000} />
            <TotalCard label="Gastos totais" value={5000} />
          </SimpleGrid>

          <Stack spacing={15} mt={40}>
            <Text size="lg" fw="bold" color="white">
              Minha Carteira
            </Text>

            <SimpleGrid
              className={classes.gridVerticalSpace}
              spacing={20}
              cols={3}
              breakpoints={[
                { maxWidth: 'lgg', cols: 2 },
                { maxWidth: 'md', cols: 3, spacing: 10 },
                { maxWidth: 'lxs', cols: 2, spacing: 10 },
              ]}
            >
              <WalletCard name="Banco do Brasil" amount={5000} />
              <WalletCard name="Neon" amount={2000} />
              <WalletCard name="Bradesco" amount={895.9} />
              <WalletCard name="Itaú" amount={50000} />
              <NewItemCard height={130} link="/" />
            </SimpleGrid>
          </Stack>

          <Stack spacing={15} mt={40}>
            <Group position="apart">
              <Text size="lg" fw="bold" color="white">
                Minhas Categorias
              </Text>

              <Switch
                checked={categoriesChecked}
                onChange={(event) =>
                  setCategoriesChecked(event.currentTarget.checked)
                }
                color="teal.9"
                thumbIcon={
                  !categoriesChecked ? (
                    <IconMinus color="red" size="0.7rem" />
                  ) : (
                    <IconPlus color="teal" size="0.7rem" />
                  )
                }
              />
            </Group>

            <SimpleGrid
              className={classes.gridVerticalSpace}
              spacing={20}
              cols={3}
              breakpoints={[
                { maxWidth: 'lgg', cols: 2 },
                { maxWidth: 'md', cols: 3, spacing: 10 },
                { maxWidth: 'lxs', cols: 2, spacing: 10 },
              ]}
            >
              <CategoryCard type="income" name="Investimentos" />
              <CategoryCard type="income" name="Salário" />
              <CategoryCard type="income" name="Cashback" />
              <CategoryCard type="income" name="Vendas" />
              <NewItemCard height={95} link="/" />
            </SimpleGrid>
          </Stack>
        </Container>

        <Container
          className={classes.rightContainer}
          fluid
          my={30}
          bg={colorScheme === 'dark' ? 'dark.6' : 'gray.1'}
          p={30}
          sx={{
            borderRadius: '10px 0px 0px 10px',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          <Stack spacing={20}>
            <Group position="apart">
              <ListTransactionsTransfersMenu
                menuSelected={menuSelected}
                setMenuSelected={setMenuSelected}
              />

              <Group spacing={25}>
                <Group spacing={10}>
                  {menuSelected === 'transactions' && <Switch color="teal.9" />}

                  <ActionIcon
                    variant="transparent"
                    color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
                  >
                    <IconCalendarSearch size="1.56rem" />
                  </ActionIcon>

                  <ActionIcon
                    variant="transparent"
                    color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
                  >
                    <IconSortDescending2 size="1.56rem" />
                  </ActionIcon>
                </Group>

                <ActionIcon
                  variant="transparent"
                  color={colorScheme === 'dark' ? 'gray.0' : 'violet.6'}
                >
                  <IconCirclePlus size="1.56rem" />
                </ActionIcon>
              </Group>
            </Group>

            <Stack spacing={10}>
              {menuSelected === 'transactions' &&
                [1, 2, 3].map((item) => (
                  <TransactionCard
                    key={item}
                    name="Investimentos"
                    categoryName="Investimentos"
                    accountName="Banco do Brasil"
                    value={1250}
                    type="income"
                    createdAt={new Date()}
                  />
                ))}

              {menuSelected === 'transfers' &&
                [1, 2, 3].map((item) => (
                  <TransferCard
                    key={item}
                    fromAccountName="Banco do Brasil"
                    toAccountName="Itaú"
                    value={500}
                    createdAt={new Date()}
                  />
                ))}

              {/*<NewItemCard link="/" />*/}
            </Stack>
          </Stack>
        </Container>
      </Group>
    </Box>
  );

  /*return (
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

      <Container
        className={classes.container}
        py={20}
        bg={colorScheme === 'dark' ? 'gray.8' : 'gray.4'}
      >
        <Box className={classes.innerContainer}>
          <Group position="apart" mb={15}>
            <Text
              color={colorScheme === 'dark' ? 'white' : 'dark'}
              weight="bold"
            >
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
        </Box>
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
  );*/
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
