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

interface TransactionCard {
  name: string;
  date: Date;
  value: number;
  category: string;
  type: 'income' | 'expense';
}

export default function TransactionCard({
  name,
  date,
  value,
  category,
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

  const onDelete = () => console.log('excluei');

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
            {category}
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
            editLink="/editar/transacao"
            toggleOptions={<ShowOptions />}
            handleShowOptions={handleShowOptions}
            onDelete={onDelete}
          />
        )}
      </Group>
    </Card>
  );
}
