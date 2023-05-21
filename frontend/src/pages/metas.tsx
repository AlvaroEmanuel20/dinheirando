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
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowLeft, IconCurrencyReal, IconEdit } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { createCategorySchema } from '@/lib/schemas/categories';
import useSWRMutation from 'swr/mutation';
import { updateService } from '@/lib/mutateServices';
import { authOptions } from './api/auth/[...nextauth]';
import { User, UserId } from '@/lib/apiTypes/users';
import { updateGoalsSchema } from '@/lib/schemas/users';

interface Arg {
  arg: {
    incomeGoal: number;
    expenseGoal: number;
  };
}

interface Goals {
  goals: {
    incomeGoal: number;
    expenseGoal: number;
  };
}

export default function EditGoals({ goals }: Goals) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/users', updateService<UserId, Arg>, {
    onSuccess(data, key, config) {
      router.push('/');
    },
  });

  const form = useForm({
    validate: zodResolver(updateGoalsSchema),
    initialValues: {
      incomeGoal: goals.incomeGoal,
      expenseGoal: goals.expenseGoal,
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
            Atualizar metas
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
            <NumberInput
              withAsterisk
              decimalSeparator=","
              thousandsSeparator="."
              label="Meta de ganhos"
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
              {...form.getInputProps('incomeGoal')}
            />

            <NumberInput
              withAsterisk
              decimalSeparator=","
              thousandsSeparator="."
              label="Meta de gastos"
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
              {...form.getInputProps('expenseGoal')}
            />

            <Button type="submit" color="yellow.6">
              {isMutating ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Atualizar'
              )}
            </Button>

            {errorMutate && (
              <Text size="sm" color="red">
                {errorMutate.response.status === 404 &&
                  'Usuário não encontrada'}
                {errorMutate.response.status === 500 &&
                  'Erro interno no servidor'}
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  const user: User = await res.json();

  return {
    props: {
      goals: {
        incomeGoal: user.incomeGoal,
        expenseGoal: user.expenseGoal,
      },
    },
  };
};
