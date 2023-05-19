import { formatMoney } from '@/lib/formatMoney';
import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconArrowRight, IconDotsVertical } from '@tabler/icons-react';
import { format } from 'our-dates';
import { useState } from 'react';
import CardOptions from '../shared/CardOptions';

interface TransferCard {
  fromAccount: string;
  toAccount: string;
  date: Date;
  value: number;
}

export default function TransferCard({
  fromAccount,
  toAccount,
  date,
  value,
}: TransferCard) {
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
    <Card withBorder p={10} bg={colorScheme === 'dark' ? 'gray.7' : 'white'}>
      <Group position="apart">
        <Stack spacing={2}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
            {fromAccount}
          </Text>
          <Text color="dimmed" size="xs">
            {format(date, 'dd/MM/yyyy')}
          </Text>
        </Stack>

        <IconArrowRight size="1.5rem" />

        {!showOptions && (
          <Group spacing={8}>
            <Stack spacing={2} align="flex-end">
              <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
                {toAccount}
              </Text>
              <Text
                weight="bold"
                size="sm"
                color={colorScheme === 'dark' ? 'white' : 'dark'}
              >
                R${formatMoney.format(value)}
              </Text>
            </Stack>

            <ShowOptions />
          </Group>
        )}

        {showOptions && (
          <CardOptions
            editLink="/editar/transferencia"
            toggleOptions={<ShowOptions />}
            handleShowOptions={handleShowOptions}
            onDelete={onDelete}
          />
        )}
      </Group>
    </Card>
  );
}
