import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Button,
  Container,
  Group,
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

export default function AddAccount() {
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
            Adicionar conta
          </Text>
        </Group>
      </AppHeader>

      <Container mt={20} mb={50}>
        <Stack spacing={10}>
          <TextCustomInput
            placeholder="Banco do Brasil"
            label="Nome"
            withAsterisk
            icon={<IconEdit size="1rem" />}
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
          />

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
