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
import { IconEdit, IconTrash, IconWallet } from '@tabler/icons-react';
import { useState } from 'react';
import EditWalletForm from './EditWalletForm';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { deleteService } from '@/lib/mutateServices';
import { AccountId } from '@/lib/apiTypes/accounts';
import { notifications } from '@mantine/notifications';

interface WalletCard {
  id: string;
  name: string;
  amount: number;
}

export default function WalletCard({ id, name, amount }: WalletCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/accounts/${id}`, deleteService<AccountId>, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro ao excluir conta',
        message: 'Há transações ou transferências usando essa conta',
      });
    },
  });

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/accounts')
      );
    } catch (error) {}
  };

  return (
    <>
      <Card
        h={130}
        radius="6px"
        px={12}
        py={16}
        bg={colorScheme === 'dark' ? 'dark.5' : ''}
        sx={{
          borderTop: `4px solid ${
            colorScheme === 'dark' ? '#7048E8' : '#ADB5BD'
          }`,
        }}
      >
        <Stack spacing={5}>
          <Group spacing={12}>
            <ActionIcon
              onClick={() => setOptions(!options)}
              variant="filled"
              color={colorScheme === 'dark' ? 'violet.6' : 'gray.6'}
              radius="xl"
            >
              <IconWallet size="1rem" />
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

          <Stack spacing={0}>
            <Text color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}>
              {name}
            </Text>
            <Text
              color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}
              fw="bold"
            >
              R${formatMoney.format(amount)}
            </Text>
          </Stack>
        </Stack>
      </Card>

      <Modal centered opened={opened} onClose={close} title="Editar Conta">
        <EditWalletForm close={close} account={{ _id: id, name, amount }} />
      </Modal>
    </>
  );
}
