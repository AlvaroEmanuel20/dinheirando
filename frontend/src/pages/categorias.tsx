import CategoryCard from '@/components/categories/CategoryCard';
import AppFooter from '@/components/shared/AppFooter';
import AppHeader from '@/components/shared/AppHeader';
import {
  ActionIcon,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import useCategories from '@/hooks/useCategories';
import { Category } from '@/lib/apiTypes/categories';
import NoData from '@/components/shared/NoData';

export default function Categories() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: incomeCategories,
    isLoading: isLoadingIncomeCategories,
    error: errorIncomeCategories,
  } = useCategories<Category[]>({ type: 'income' });

  const {
    data: expenseCategories,
    isLoading: isLoadingExpenseCategories,
    error: errorExpenseCategories,
  } = useCategories<Category[]>({ type: 'expense' });

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
          {isLoadingIncomeCategories && (
            <div>
              <Skeleton mb={10} height={60} />
              <Skeleton height={60} />
            </div>
          )}

          {incomeCategories &&
            incomeCategories.map((category) => (
              <CategoryCard
                key={category._id}
                name={category.name}
                type="income"
                totalOfTransactions={category.totalOfTransactions}
              />
            ))}

          {!isLoadingIncomeCategories && incomeCategories?.length === 0 && (
            <NoData
              color="green.8"
              link="/adicionar/categoria"
              text="Nenhuma categoria encontrada"
            />
          )}
        </Stack>
      </Container>

      <Container mt={20} mb={90}>
        <Text mb={15} weight="bold">
          Suas categorias de gasto
        </Text>

        <Stack spacing={10}>
          {isLoadingExpenseCategories && (
            <div>
              <Skeleton mb={10} height={60} />
              <Skeleton height={60} />
            </div>
          )}

          {expenseCategories &&
            expenseCategories.map((category) => (
              <CategoryCard
                key={category._id}
                name={category.name}
                type="expense"
                totalOfTransactions={category.totalOfTransactions}
              />
            ))}

          {!isLoadingExpenseCategories && expenseCategories?.length === 0 && (
            <NoData
              color="red.8"
              link="/adicionar/categoria"
              text="Nenhuma categoria encontrada"
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
