import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  Button,
  Chip,
  Group,
  Loader,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconCalendar,
  IconCurrencyReal,
  IconEdit,
  IconTags,
  IconWallet,
} from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { createTransactionSchema } from '@/lib/schemas/transactions';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import useCategories from '@/hooks/useCategories';
import { Category } from '@/lib/apiTypes/categories';
import useSWRMutation from 'swr/mutation';
import { Transaction, TransactionId } from '@/lib/apiTypes/transactions';
import { updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

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

export default function EditTransactionForm({
  transaction,
  close,
}: {
  transaction: Transaction;
  close: () => void;
  }) {

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(
    `/transactions/${transaction._id}`,
    updateService<TransactionId, Arg>,
    {
      onSuccess(data, key, config) {
        close();
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

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            await trigger(values);
            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/transactions')
            );

            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/accounts')
            );
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
                  borderColor: theme.colors.violet[6],
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
                  borderColor: theme.colors.violet[6],
                },
              },
              day: {
                '&[data-selected]': {
                  backgroundColor: theme.colors.violet[6],
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
                  borderColor: theme.colors.violet[6],
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
                  borderColor: theme.colors.violet[6],
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
            color="violet.6"
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
    </>
  );
}
