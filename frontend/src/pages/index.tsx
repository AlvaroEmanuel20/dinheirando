import {
  ActionIcon,
  Anchor,
  Burger,
  Button,
  Card,
  Center,
  Container,
  Group,
  Menu,
  Progress,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { apiInstance } from '@/lib/apiInstance';
import useAuth from '@/hooks/useAuth';
import ThemeToggle from '@/components/shared/ThemeToggle';
import AppHeader from '@/components/shared/AppHeader';
import Link from 'next/link';
import TotalCard from '@/components/home/TotalCard';
import GoalCard from '@/components/home/GoalCard';
import TransactionCard from '@/components/shared/TransactionCard';
import {
  IconArrowsLeftRight,
  IconPlus,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';
import AppFooter from '@/components/shared/AppFooter';

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
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
        <Stack spacing={1} mt="xl">
          <Text size="sm" color="white">
            Saldo total:
          </Text>
          <Text size="xl" weight="bold" color="white">
            R$150.000,00
          </Text>
        </Stack>

        <Group grow spacing={20} mt="xl" pb="sm">
          <TotalCard value={200000} label="Ganhos totais:" bg="green.9" />
          <TotalCard value={50000} label="Gastos totais:" bg="red.9" />
        </Group>
      </AppHeader>

      <Container py={20} bg={colorScheme === 'dark' ? 'gray.8' : 'gray.4'}>
        <Group position="apart" mb={15}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} weight="bold">
            Suas metas
          </Text>

          <Anchor
            component={Link}
            href="/preferencias"
            color={colorScheme === 'dark' ? 'white' : 'dark'}
            size="sm"
          >
            Alterar
          </Anchor>
        </Group>

        <Group grow spacing={20} mt="xl" pb="sm">
          <GoalCard
            bg={colorScheme === 'dark' ? 'gray.7' : 'gray.2'}
            label="Meta de ganhos:"
            value={200000}
            progress={{ color: 'green.7', value: 54.31 }}
          />

          <GoalCard
            bg={colorScheme === 'dark' ? 'gray.7' : 'gray.2'}
            label="Meta de gastos:"
            value={50000}
            progress={{ color: 'red.7', value: 54.31 }}
          />
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
          <TransactionCard
            name="Compras online"
            date={new Date(2023, 4, 7)}
            value={1500}
            category="Compras"
            type="expense"
          />

          <TransactionCard
            name="Meus investimentos"
            date={new Date(2023, 4, 7)}
            value={1000}
            category="Investimentos"
            type="income"
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
