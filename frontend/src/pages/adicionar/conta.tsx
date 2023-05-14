import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowLeft, IconCurrencyReal, IconEdit } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import { useForm, zodResolver } from '@mantine/form';
import { createAccountSchema } from '@/lib/schemas/accounts';
import { AccountId } from '@/lib/apiTypes/accounts';
import { apiInstance } from '@/lib/apiInstance';
import useSWRMutation from 'swr/mutation';

interface Arg {
  arg: {
    name: string;
    amount: number;
  };
}

async function createAccount(url: string, { arg }: Arg) {
  return apiInstance.post<AccountId>(url, arg).then((res) => res.data);
}

export default function AddAccount() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/accounts', createAccount, {
    onSuccess(data, key, config) {
      router.push('/carteira');
    },
  });

  const form = useForm({
    validate: zodResolver(createAccountSchema),
    initialValues: {
      name: '',
      amount: 0,
    },
  });

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
            Adicionar conta
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
                    borderColor: theme.colors.yellow[5],
                  },
                },
              })}
              {...form.getInputProps('amount')}
            />

            <Button type="submit" color="yellow.6">
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
