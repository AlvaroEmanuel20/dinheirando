import CategoryCard from '@/components/categories/CategoryCard';
import AppFooter from '@/components/shared/AppFooter';
import AppHeader from '@/components/shared/AppHeader';
import { ActionIcon, Container, Group, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Categories() {
  const router = useRouter();
  const { data: session } = useSession();

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
            Categorias
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20}>
        <Text mb={15} weight="bold">
          Suas categorias de ganho
        </Text>

        <Stack spacing={10}>
          <CategoryCard
            name="Investimentos"
            type="income"
            totalOfTransactions={1000}
          />
          <CategoryCard
            name="Salário"
            type="income"
            totalOfTransactions={450}
          />
          <CategoryCard
            name="Cashback"
            type="income"
            totalOfTransactions={800}
          />
        </Stack>
      </Container>

      <Container mt={20} mb={90}>
        <Text mb={15} weight="bold">
          Suas categorias de gasto
        </Text>

        <Stack spacing={10}>
          <CategoryCard
            name="Compras"
            type="expense"
            totalOfTransactions={600}
          />
          <CategoryCard
            name="Viagens"
            type="expense"
            totalOfTransactions={490}
          />
          <CategoryCard name="Lazer" type="expense" totalOfTransactions={800} />
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
