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
import { useState } from 'react';
import EditTransferForm from './EditTransferForm';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { deleteService } from '@/lib/mutateServices';
import { TransferId } from '@/lib/apiTypes/transfers';
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';

interface TransferCard {
  id: string;
  fromAccount: { _id: string; name: string };
  toAccount: { _id: string; name: string };
  createdAt: Date;
  value: number;
}

export default function TransferCard({
  id,
  fromAccount,
  toAccount,
  createdAt,
  value,
}: TransferCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/transfers/${id}`, deleteService<TransferId>, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro ao excluir transferência',
        message: 'Houve um erro ao excluir transferência',
      });
    },
  });

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/transfers')
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
          borderLeft: `4px solid ${
            colorScheme === 'dark' ? '#7048E8' : '#495057'
          }`,
        }}
        py={8}
        pl={15}
        pr={3}
        bg={colorScheme === 'dark' ? 'dark.5' : ''}
      >
        <Group position="apart">
          <Stack spacing={2}>
            <Text
              size="sm"
              color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
            >
              De{' '}
              <Text span fw="bold">
                {fromAccount.name}
              </Text>
            </Text>
            <Text
              size="sm"
              color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
            >
              Para{' '}
              <Text span fw="bold">
                {toAccount.name}
              </Text>
            </Text>
          </Stack>

          <Group spacing={10}>
            {!options && (
              <Stack align="flex-end" spacing={2}>
                <Text
                  size="xs"
                  color={colorScheme === 'dark' ? 'gray.5' : 'dimmed'}
                >
                  {format(createdAt, 'dd/MM/yyyy')}
                </Text>
                <Text
                  size="sm"
                  color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
                  fw="bold"
                >
                  R${formatMoney.format(value)}
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
                  loading={isMutating}
                  size="xs"
                  variant="transparent"
                  color={colorScheme === 'dark' ? 'red.6' : 'red'}
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

      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Editar Transferência"
      >
        <EditTransferForm
          close={close}
          transfer={{ _id: id, fromAccount, toAccount, value, createdAt }}
        />
      </Modal>
    </>
  );
}
