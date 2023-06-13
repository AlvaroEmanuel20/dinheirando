import {
  Button,
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
  IconWallet,
} from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { createTransferSchema } from '@/lib/schemas/transfers';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import useSWRMutation from 'swr/mutation';
import { Transfer, TransferId } from '@/lib/apiTypes/transfers';
import { updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface Arg {
  arg: {
    fromAccount: string;
    toAccount: string;
    createdAt: Date;
    value: number;
  };
}

export default function EditTransferForm({
  transfer,
  close,
}: {
  transfer: Transfer;
  close: () => void;
}) {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(
    `/transfers/${transfer._id}`,
    updateService<TransferId, Arg>,
    {
      onSuccess(data, key, config) {
        close();
      },
    }
  );

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccounts<Account[]>();

  const form = useForm({
    validate: zodResolver(createTransferSchema),
    initialValues: {
      fromAccount: transfer.fromAccount._id,
      toAccount: transfer.toAccount._id,
      createdAt: new Date(transfer.createdAt),
      value: transfer.value,
    },
  });

  const selectAccountData = accounts
    ? accounts.map((account) => {
        return { label: account.name, value: account._id };
      })
    : ['Carregando...'];

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            await trigger(values);
            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/accounts')
            );

            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/transfers')
            );
          } catch (error) {}
        })}
      >
        <Stack spacing={10}>
          <Select
            disabled={isLoadingAccounts}
            clearable
            withAsterisk
            label="Conta de origem"
            placeholder={
              isLoadingAccounts
                ? 'Carregando...'
                : 'Selecione a conta de origem'
            }
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
            {...form.getInputProps('fromAccount')}
          />

          <Select
            disabled={isLoadingAccounts}
            clearable
            withAsterisk
            label="Conta de destino"
            placeholder={
              isLoadingAccounts ? 'Carregando...' : 'Selecione a conta destino'
            }
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
            {...form.getInputProps('toAccount')}
          />

          <DatePickerInput
            dropdownType="modal"
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

          <NumberInput
            withAsterisk
            decimalSeparator=","
            thousandsSeparator="."
            label="Valor"
            placeholder="500,00"
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

          <Button
            disabled={isLoadingAccounts && true}
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
              {errorMutate.response.status === 409 &&
                'Contas não podem ser iguais'}
              {errorMutate.response.status === 404 &&
                'Transferência não encontrada'}
              {errorMutate.response.status === 500 &&
                'Erro interno no servidor'}
            </Text>
          )}
        </Stack>
      </form>
    </>
  );
}
