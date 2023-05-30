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

interface TransferCard {
  fromAccountName: string;
  toAccountName: string;
  createdAt: Date;
  value: number;
}

export default function TransferCard({
  fromAccountName,
  toAccountName,
  createdAt,
  value,
}: TransferCard) {
  const [options, setOptions] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
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
          <Text size="sm" color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}>
            De{' '}
            <Text span fw="bold">
              {fromAccountName}
            </Text>
          </Text>
          <Text size="sm" color={colorScheme === 'dark' ? 'gray.0' : 'gray.7'}>
            Para{' '}
            <Text span fw="bold">
              {toAccountName}
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
