import {
  Anchor,
  Burger,
  Button,
  Card,
  Container,
  Group,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { apiInstance } from '@/lib/apiInstance';
import useAuth from '@/hooks/useAuth';
import ThemeToggle from '@/components/shared/ThemeToggle';
import HomeHeader from '@/components/home/HomeHeader';
import Link from 'next/link';
import TotalCard from '@/components/home/TotalCard';
import GoalCard from '@/components/home/GoalCard';

export default function Home() {
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
      <HomeHeader>
        <Stack spacing={1} mt="xl">
          <Text size="sm" color="white">
            Saldo total:
          </Text>
          <Text size="xl" weight="bold" color="white">
            R$150.000,00
          </Text>
        </Stack>

        <Group spacing={20} mt="xl" pb="sm">
          <TotalCard value={200000} label="Ganhos totais:" bg="green.9" />
          <TotalCard value={50000} label="Gastos totais:" bg="red.9" />
        </Group>
      </HomeHeader>

      <Container py={20} bg="gray.4">
        <Group position="apart" mb={15}>
          <Text color="dark" weight="bold">
            Suas metas
          </Text>

          <Anchor component={Link} href="/preferencias" color="dark" size="sm">
            Alterar
          </Anchor>
        </Group>

        <Group spacing={20} mt="xl" pb="sm">
          <GoalCard
            bg="gray.2"
            label="Meta de ganhos:"
            value={200000}
            progress={{ color: 'green.7', value: 54.31 }}
          />

          <GoalCard
            bg="gray.2"
            label="Meta de gastos:"
            value={50000}
            progress={{ color: 'red.7', value: 54.31 }}
          />
        </Group>
      </Container>

      <Container mt={20}>
        <Group position="apart" mb={15}>
          <Text weight="bold">Transações recentes</Text>
          <Anchor component={Link} href="/preferencias" color="dark" size="sm">
            Ver tudo
          </Anchor>
        </Group>

        <Stack spacing={10}>
          <Card withBorder p={10}>
            <Group position="apart">
              <Stack spacing={2}>
                <Text size="sm">Compras online</Text>
                <Text color="dimmed" size="xs">
                  07/05/2023
                </Text>
              </Stack>

              <Text weight="bold" color="red">
                R$1.500,00
              </Text>
            </Group>
          </Card>

          <Card withBorder p={10}>
            <Group position="apart">
              <Stack spacing={2}>
                <Text size="sm">Inverstimentos</Text>
                <Text color="dimmed" size="xs">
                  07/05/2023
                </Text>
              </Stack>

              <Text weight="bold" color="green">
                R$1.500,00
              </Text>
            </Group>
          </Card>
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
