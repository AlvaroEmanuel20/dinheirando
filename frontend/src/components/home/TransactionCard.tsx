import { useStylesHome } from '@/hooks/styles/useStylesHome';
import { formatMoney } from '@/lib/formatMoney';
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
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'our-dates';
import { useState } from 'react';
import EditTransactionForm from './EditTransactionForm';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { deleteService } from '@/lib/mutateServices';
import { TransactionId } from '@/lib/apiTypes/transactions';
import { notifications } from '@mantine/notifications';

interface TransactionCard {
  id: string;
  name: string;
  category: { _id: string; name: string };
  account: { _id: string; name: string };
  createdAt: Date;
  value: number;
  type: 'income' | 'expense';
}

export default function TransactionCard({
  id,
  name,
  category,
  account,
  createdAt,
  value,
  type,
}: TransactionCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStylesHome();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/transactions/${id}`, deleteService<TransactionId>, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro ao excluir transação',
        message: 'Houve um erro ao excluir transação',
      });
    },
  });

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/transactions')
      );

      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/accounts')
      );
    } catch (error) {}
  };

  return (
    <>
      <Card
        sx={{
          borderLeft: `4px solid ${type === 'income' ? '#087F5B' : '#FA5252'}`,
        }}
        py={8}
        pl={10}
        pr={2}
        className={classes.transactionCard}
        bg={colorScheme === 'dark' ? 'dark.5' : ''}
      >
        <Group position="apart">
          <Stack spacing={2}>
            <Text
              fw="bold"
              size="sm"
              color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
            >
              {name}
            </Text>
            <Text
              size="xs"
              color={colorScheme === 'dark' ? 'gray.5' : 'dimmed'}
            >
              {category.name} | {format(createdAt, 'dd/MM/yyyy')}
            </Text>
          </Stack>

          <Group spacing={10}>
            {!options && (
              <Stack align="flex-end" spacing={2}>
                <Text
                  size="xs"
                  color={colorScheme === 'dark' ? 'gray.5' : 'dimmed'}
                >
                  {account.name}
                </Text>
                <Text
                  size="sm"
                  color={type === 'income' ? 'teal.9' : 'red'}
                  fw="bold"
                >
                  {type === 'income' ? '+' : '-'} R${formatMoney.format(value)}
                </Text>
              </Stack>
            )}

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

            <ActionIcon
              onClick={() => setOptions(!options)}
              variant="transparent"
              color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
            >
              <IconDotsVertical size="1.56rem" />
            </ActionIcon>
          </Group>
        </Group>
      </Card>

      <Modal centered opened={opened} onClose={close} title="Editar Transação">
        <EditTransactionForm
          close={close}
          transaction={{
            _id: id,
            name,
            account,
            category,
            createdAt,
            type,
            value,
          }}
        />
      </Modal>
    </>
  );
}
