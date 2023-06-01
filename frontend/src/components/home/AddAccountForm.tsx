import TextCustomInput from '@/components/shared/TextCustomInput';
import { Button, Loader, NumberInput, Stack, Text } from '@mantine/core';
import { IconCurrencyReal, IconEdit } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { createAccountSchema } from '@/lib/schemas/accounts';
import { AccountId } from '@/lib/apiTypes/accounts';
import useSWRMutation from 'swr/mutation';
import { createService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface Arg {
  arg: {
    name: string;
    amount: number;
  };
}

export default function AddAccountForm({ close }: { close: () => void }) {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/accounts', createService<AccountId, Arg>, {
    onSuccess(data, key, config) {
      close();
    },
  });

  const form = useForm({
    validate: zodResolver(createAccountSchema),
    initialValues: {
      name: '',
      amount: 0,
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
              'Adicionar'
            )}
          </Button>

          {errorMutate && (
            <Text size="sm" color="red">
              {errorMutate.response.status === 409
                ? 'Já existe uma conta com esse nome'
                : 'Error interno no servidor'}
            </Text>
          )}
        </Stack>
      </form>
    </>
  );
}
