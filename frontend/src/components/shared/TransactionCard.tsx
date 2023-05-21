import { formatMoney } from '@/lib/formatMoney';
import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { format } from 'our-dates';
import { useState } from 'react';
import CardOptions from './CardOptions';
import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { deleteService } from '@/lib/mutateServices';
import { TransactionId } from '@/lib/apiTypes/transactions';

interface TransactionCard {
  id: string;
  name: string;
  date: Date;
  value: number;
  category: string;
  account: string;
  type: 'income' | 'expense';
}

export default function TransactionCard({
  id,
  name,
  date,
  value,
  category,
  account,
  type,
}: TransactionCard) {
  const { colorScheme } = useMantineColorScheme();
  const [showOptions, setShowOptions] = useState(false);
  const handleShowOptions = () => setShowOptions(!showOptions);
  const ShowOptions = () => (
    <ActionIcon onClick={handleShowOptions}>
      <IconDotsVertical />
    </ActionIcon>
  );

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/transactions/${id}`, deleteService<TransactionId>);

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
    <Card
      mih={67}
      withBorder
      p={10}
      bg={colorScheme === 'dark' ? 'gray.7' : 'white'}
    >
      <Group position="apart">
        <Stack spacing={2}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {category} | {account}
          </Text>
        </Stack>

        {!showOptions && (
          <Group spacing={8}>
            <Stack spacing={2} align="flex-end">
              <Text
                weight="bold"
                color={type === 'income' ? 'green.5' : 'red.6'}
              >
                R${formatMoney.format(value)}
              </Text>
              <Text color="dimmed" size="xs">
                {format(date, 'dd/MM/yyyy')}
              </Text>
            </Stack>

            <ShowOptions />
          </Group>
        )}

        {showOptions && (
          <CardOptions
            editLink={`/editar/transacao/${id}`}
            toggleOptions={<ShowOptions />}
            onDelete={onDelete}
            isDeleting={isMutating}
          />
        )}
      </Group>
    </Card>
  );
}
