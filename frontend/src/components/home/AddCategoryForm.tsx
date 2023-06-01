import TextCustomInput from '@/components/shared/TextCustomInput';
import { Button, Chip, Group, Loader, Stack, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { createCategorySchema } from '@/lib/schemas/categories';
import { CategoryId } from '@/lib/apiTypes/categories';
import useSWRMutation from 'swr/mutation';
import { createService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface Arg {
  arg: {
    name: string;
    type: string;
  };
}

export default function AddCategoryForm({ close }: { close: () => void }) {
  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/categories', createService<CategoryId, Arg>, {
    onSuccess(data, key, config) {
      close();
    },
  });

  const form = useForm({
    validate: zodResolver(createCategorySchema),
    initialValues: {
      name: '',
      type: 'income',
    },
  });

  return (
    <>
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            await trigger(values);
            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/categories')
            );
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
                ? 'Já existe uma categoria com esse nome'
                : 'Error interno no servidor'}
            </Text>
          )}
        </Stack>
      </form>
    </>
  );
}
