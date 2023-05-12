import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
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

export default function AddTransaction() {
  const router = useRouter();
  const { data: session } = useSession();

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
        <Stack spacing={10}>
          <TextCustomInput
            placeholder="Meus investimentos"
            label="Nome"
            withAsterisk
            icon={<IconEdit size="1rem" />}
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
          />

          <Select
            clearable
            withAsterisk
            label="Categoria"
            placeholder="Selecione a categoria"
            data={['Investimentos', 'Salário', 'Cashback']}
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
          />

          <Select
            clearable
            withAsterisk
            label="Conta"
            placeholder="Selecione a conta"
            data={['Banco do Brasil', 'Inter', 'Neon']}
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
          />

          <Group spacing={15} my={10}>
            <Text size="sm" weight={500}>
              Tipo:{' '}
            </Text>

            <Chip.Group>
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

          <Button color="yellow.6">Adicionar</Button>
        </Stack>
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
