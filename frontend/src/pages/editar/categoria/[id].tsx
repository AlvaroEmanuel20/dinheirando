import AppHeader from '@/components/shared/AppHeader';
import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  ActionIcon,
  Button,
  Chip,
  Container,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { IconArrowLeft, IconEdit } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useForm, zodResolver } from '@mantine/form';
import { createCategorySchema } from '@/lib/schemas/categories';
import { Category, CategoryId } from '@/lib/apiTypes/categories';
import useSWRMutation from 'swr/mutation';
import { updateService } from '@/lib/mutateServices';

interface Arg {
  arg: {
    name: string;
    type: string;
  };
}

export default function AddCategory({ category }: { category: Category }) {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(
    `/categories/${category._id}`,
    updateService<CategoryId, Arg>,
    {
      onSuccess(data, key, config) {
        router.push('/categorias');
      },
    }
  );

  const form = useForm({
    validate: zodResolver(createCategorySchema),
    initialValues: {
      name: category.name,
      type: category.type,
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
            Atualizar categoria
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
              placeholder="Investimentos"
              label="Nome"
              withAsterisk
              icon={<IconEdit size="1rem" />}
              {...form.getInputProps('name')}
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

            <Button type="submit" color="yellow.6">
              {isMutating ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Atualizar'
              )}
            </Button>

            {errorMutate && (
              <Text size="sm" color="red">
                {errorMutate.response.status === 409 &&
                  'Já existe uma categoria com esse nome'}
                {errorMutate.response.status === 404 &&
                  'Categoria não encontrada'}
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

  if (!ctx.query.id) {
    return {
      redirect: {
        destination: '/categorias',
        permanent: false,
      },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${ctx.query.id}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    }
  );

  return {
    props: {
      category: await res.json(),
    },
  };
};
