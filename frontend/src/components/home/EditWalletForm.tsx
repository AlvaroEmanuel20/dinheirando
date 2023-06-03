import TextCustomInput from '@/components/shared/TextCustomInput';
import { Button, Loader, NumberInput, Stack, Text } from '@mantine/core';
import { IconCurrencyReal, IconEdit } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { createAccountSchema } from '@/lib/schemas/accounts';
import { Account, AccountId } from '@/lib/apiTypes/accounts';
import useSWRMutation from 'swr/mutation';
import { updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface Arg {
  arg: {
    name: string;
    amount: number;
  };
}

export default function EditWalletForm({
  account,
  close,
}: {
  account: Account;
  close: () => void;
}) {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(
    `/accounts/${account._id}`,
    updateService<AccountId, Arg>,
    {
      onSuccess(data, key, config) {
        close();
      },
    }
  );

  const form = useForm({
    validate: zodResolver(createAccountSchema),
    initialValues: {
      name: account.name,
      amount: account.amount,
    },
  });

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
              (key) =>
                typeof key === 'string' && key.startsWith('/transactions')
            );

            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/transfers')
            );
          } catch (error) {}
        })}
      >
        <Stack spacing={10}>
          <TextCustomInput
            placeholder="Banco do Brasil"
            label="Nome"
            withAsterisk
            icon={<IconEdit size="1rem" />}
            {...form.getInputProps('name')}
          />

          <NumberInput
            withAsterisk
            decimalSeparator=","
            thousandsSeparator="."
            label="Saldo"
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
            {...form.getInputProps('amount')}
          />

          <Button type="submit" color="violet.6">
            {isMutating ? (
              <Loader size="xs" variant="dots" color="white" />
            ) : (
              'Atualizar'
            )}
          </Button>

          {errorMutate && (
            <Text size="sm" color="red">
              {errorMutate.response.status === 409 &&
                'Já existe uma conta com esse nome'}
              {errorMutate.response.status === 404 && 'Conta não encontrada'}
              {errorMutate.response.status === 500 &&
                'Erro interno no servidor'}
            </Text>
          )}
        </Stack>
      </form>
    </>
  );
}
