import AppHeader from '@/components/shared/AppHeader';
import {
  ActionIcon,
  Alert,
  Button,
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
  IconAlertCircle,
  IconArrowLeft,
  IconCalendar,
  IconCurrencyReal,
  IconWallet,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { authOptions } from '../api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { createTransferSchema } from '@/lib/schemas/transfers';
import useAccounts from '@/hooks/useAccounts';
import { Account } from '@/lib/apiTypes/accounts';
import useSWRMutation from 'swr/mutation';
import { apiInstance } from '@/lib/apiInstance';
import { TransferId } from '@/lib/apiTypes/transfers';

interface Arg {
  arg: {
    fromAccount: string;
    toAccount: string;
    createdAt: Date;
    value: number;
  };
}

async function createTransfer(url: string, { arg }: Arg) {
  return apiInstance.post<TransferId>(url, arg).then((res) => res.data);
}

export default function AddTransfer() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/transfers', createTransfer, {
    onSuccess(data, key, config) {
      router.push('/carteira');
    },
  });

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: errorAccounts,
  } = useAccounts<Account[]>();

  const form = useForm({
    validate: zodResolver(createTransferSchema),
    initialValues: {
      fromAccount: '',
      toAccount: '',
      createdAt: new Date(),
      value: 0,
    },
  });

  const selectAccountData = accounts
    ? accounts.map((account) => {
        return { label: account.name, value: account._id };
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
            Adicionar transferência
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
            {!isLoadingAccounts && accounts && accounts.length < 1 && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Aviso"
                color="yellow"
                variant="outline"
              >
                Para adicionar uma transferência é preciso cadastrar contas
              </Alert>
            )}

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
              {...form.getInputProps('fromAccount')}
            />

            <Select
              disabled={isLoadingAccounts}
              clearable
              withAsterisk
              label="Conta de destino"
              placeholder={
                isLoadingAccounts
                  ? 'Carregando...'
                  : 'Selecione a conta destino'
              }
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
              {...form.getInputProps('toAccount')}
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
                    borderColor: theme.colors.yellow[5],
                  },
                },
              })}
              {...form.getInputProps('value')}
            />

            <Button
              disabled={isLoadingAccounts && true}
              type="submit"
              color="yellow.6"
            >
              {isMutating ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Adicionar'
              )}
            </Button>

            {errorMutate && (
              <Text size="sm" color="red">
                {errorMutate.response.status === 404
                  ? 'Conta de origem ou de destino não encontrada'
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

  return {
    props: {},
  };
};
