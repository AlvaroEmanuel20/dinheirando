import { formatMoney } from '@/lib/formatMoney';
import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { format } from 'our-dates';
import { useState } from 'react';

interface TransactionCard {
  name: string;
  categoryName: string;
  accountName: string;
  createdAt: Date;
  value: number;
  type: 'income' | 'expense';
}

export default function TransactionCard({
  name,
  categoryName,
  accountName,
  createdAt,
  value,
  type,
}: TransactionCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${type === 'income' ? '#087F5B' : '#FA5252'}`,
      }}
      py={8}
      pl={15}
      pr={3}
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
          <Text size="xs" color={colorScheme === 'dark' ? 'gray.5' : 'dimmed'}>
            {categoryName} | {format(createdAt, 'dd/MM/yyyy')}
          </Text>
        </Stack>

        <Group spacing={10}>
          {!options && (
            <Stack align="flex-end" spacing={2}>
              <Text
                size="xs"
                color={colorScheme === 'dark' ? 'gray.5' : 'dimmed'}
              >
                {accountName}
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
                size="xs"
                variant="transparent"
                color={colorScheme === 'dark' ? 'gray.0' : 'gray.6'}
              >
                <IconEdit size="1rem" />
              </ActionIcon>

              <ActionIcon
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
  );
}
