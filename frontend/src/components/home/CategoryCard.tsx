import {
  ActionIcon,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTags, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import EditCategoryForm from './EditCategoryForm';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { deleteService } from '@/lib/mutateServices';
import { notifications } from '@mantine/notifications';
import { CategoryId } from '@/lib/apiTypes/categories';

interface CategoryCard {
  id: string;
  name: string;
  type: string;
}

export default function CategoryCard({ id, name, type }: CategoryCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/categories/${id}`, deleteService<CategoryId>, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro ao excluir categoria',
        message: 'Há transações ou transferências usando essa categoria',
      });
    },
  });

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/categories')
      );
    } catch (error) {}
  };

  return (
    <>
      <Card
        h={95}
        radius="6px"
        px={12}
        py={14}
        sx={{
          borderTop: `4px solid ${type === 'income' ? '#087F5B' : '#FA5252'}`,
        }}
      >
        <Stack spacing={5}>
          <Group spacing={12}>
            <ActionIcon
              onClick={() => setOptions(!options)}
              variant="filled"
              color={type === 'income' ? 'teal.9' : 'red'}
              radius="xl"
            >
              <IconTags size="1rem" />
            </ActionIcon>

            {options && (
              <Group spacing={8}>
                <ActionIcon
                  onClick={open}
                  size="xs"
                  variant="transparent"
                  color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
                >
                  <IconEdit size="1rem" />
                </ActionIcon>

                <ActionIcon
                  onClick={onDelete}
                  size="xs"
                  variant="transparent"
                  color={colorScheme === 'dark' ? 'red.6' : 'red'}
                  loading={isMutating}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </Group>
            )}
          </Group>

          <Text
            size="sm"
            fw="bold"
            color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
          >
            {name}
          </Text>
        </Stack>
      </Card>

      <Modal centered opened={opened} onClose={close} title="Editar Categoria">
        <EditCategoryForm
          close={close}
          category={{ _id: id, name, type, totalOfTransactions: 0 }}
        />
      </Modal>
    </>
  );
}
