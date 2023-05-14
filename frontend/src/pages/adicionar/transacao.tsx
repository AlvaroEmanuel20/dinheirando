import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Alert,
  Button,
  Chip,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCurrencyReal,
  IconEdit,
  IconTags,
  IconWallet,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { authOptions } from '../api/auth/[...nextauth]';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm, zodResolver } from '@mantine/form';
import { createTransactionSchema } from '@/lib/schemas/transactions';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import useCategories from '@/hooks/useCategories';
import { Category } from '@/lib/apiTypes/categories';

export default function AddTransaction() {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm({
    validate: zodResolver(createTransactionSchema),
    initialValues: {
      name: '',
      category: '',
      account: '',
      createdAt: new Date(),
      value: 0,
      type: 'income',
    },
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccounts<Account[]>();

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

  const selectAccountData = accounts
    ? accounts.map((account) => {
        return { label: account.name, value: account._id };
      })
    : ['Carregando...'];

  const selectIncomeCategoryData = incomeCategories
    ? incomeCategories.map((category) => {
        return { label: category.name, value: category._id };
      })
    : ['Carregando...'];

  const selectExpenseCategoryData = expenseCategories
    ? expenseCategories.map((category) => {
        return { label: category.name, value: category._id };
      })
    : ['Carregando...'];

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
            Adicionar transação
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20} mb={50}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack spacing={10}>
            {!isLoadingAccounts && accounts && accounts.length < 1 && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Aviso"
                color="yellow"
                variant="outline"
              >
                Para adicionar uma transação é preciso cadastrar contas
              </Alert>
            )}

            {!isLoadingIncomeCategories &&
              incomeCategories &&
              incomeCategories.length < 1 && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Aviso"
                  color="yellow"
                  variant="outline"
                >
                  Para adicionar uma transação de ganho é preciso cadastrar categorias de ganho
                </Alert>
              )}

            {!isLoadingExpenseCategories &&
              expenseCategories &&
              expenseCategories.length < 1 && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Aviso"
                  color="yellow"
                  variant="outline"
                >
                  Para adicionar uma transação de gasto é preciso cadastrar categorias de gasto
                </Alert>
              )}

            <TextCustomInput
              placeholder="Meus investimentos"
              label="Nome"
              withAsterisk
              icon={<IconEdit size="1rem" />}
              {...form.getInputProps('name')}
            />

            <NumberInput
              withAsterisk
              decimalSeparator=","
              thousandsSeparator="."
              label="Valor"
              placeholder="1500,00"
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
              {...form.getInputProps('value')}
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
              {...form.getInputProps('createdAt')}
            />

            <Select
              disabled={isLoadingExpenseCategories || isLoadingIncomeCategories}
              clearable
              withAsterisk
              label="Categoria"
              placeholder="Selecione a categoria"
              data={
                form.values.type === 'income'
                  ? selectIncomeCategoryData
                  : selectExpenseCategoryData
              }
              icon={<IconTags size="1rem" />}
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
              {...form.getInputProps('category')}
            />

            <Select
              disabled={isLoadingAccounts}
              clearable
              withAsterisk
              label="Conta"
              placeholder="Selecione a conta"
              data={selectAccountData}
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
              {...form.getInputProps('account')}
            />

            <Group spacing={15} my={10}>
              <Text size="sm" weight={500}>
                Tipo:{' '}
              </Text>

              <Chip.Group multiple={false} {...form.getInputProps('type')}>
                <Group spacing={10}>
                  <Chip color="green" value="income">
                    Ganho
                  </Chip>
                  <Chip color="red" value="expense">
                    Gasto
                  </Chip>
                </Group>
              </Chip.Group>
            </Group>

            <Button
              disabled={
                isLoadingAccounts ||
                isLoadingIncomeCategories ||
                isLoadingExpenseCategories
              }
              type="submit"
              color="yellow.6"
            >
              Adicionar
            </Button>
          </Stack>
        </form>
      </Container>
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
