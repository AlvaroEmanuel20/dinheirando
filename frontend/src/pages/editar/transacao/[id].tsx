import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Button,
  Chip,
  Container,
  Group,
  Loader,
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
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm, zodResolver } from '@mantine/form';
import { createTransactionSchema } from '@/lib/schemas/transactions';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import useCategories from '@/hooks/useCategories';
import { Category } from '@/lib/apiTypes/categories';
import useSWRMutation from 'swr/mutation';
import { Transaction, TransactionId } from '@/lib/apiTypes/transactions';
import { updateService } from '@/lib/mutateServices';

interface Arg {
  arg: {
    name: string;
    category: string;
    account: string;
    createdAt: Date;
    value: number;
    type: string;
  };
}

export default function EditTransaction({
  transaction,
}: {
  transaction: Transaction;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(
    `/transactions/${transaction._id}`,
    updateService<TransactionId, Arg>,
    {
      onSuccess(data, key, config) {
        router.push('/transacoes');
      },
    }
  );

  const form = useForm({
    validate: zodResolver(createTransactionSchema),
    initialValues: {
      name: transaction.name,
      category: transaction.category._id,
      account: transaction.account._id,
      createdAt: new Date(transaction.createdAt),
      value: transaction.value,
      type: transaction.type,
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
            Atualizar transação
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20} mb={50}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              await trigger(values);
            } catch (error) {}
          })}
        >
          <Stack spacing={10}>
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
              {isMutating ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Atualizar'
              )}
            </Button>

            {errorMutate && (
              <Text size="sm" color="red">
                {errorMutate.response.status === 404
                  ? 'Transação não encontrada'
                  : 'Error interno no servidor'}
              </Text>
            )}
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

  if (!ctx.query.id) {
    return {
      redirect: {
        destination: '/transacoes',
        permanent: false,
      },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/transactions/${ctx.query.id}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    }
  );

  return {
    props: {
      transaction: await res.json(),
    },
  };
};
