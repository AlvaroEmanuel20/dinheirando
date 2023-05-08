import { formatMoney } from '@/lib/formatMoney';
import { Card, Group, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { format } from 'our-dates';

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

  return (
    <Card withBorder p={10} bg={colorScheme === 'dark' ? 'gray.7' : 'white'}>
      <Group position="apart">
        <Stack spacing={2}>
          <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            {category}
          </Text>
        </Stack>

        <Stack spacing={2} align="flex-end">
          <Text weight="bold" color={type === 'income' ? 'green.5' : 'red.6'}>
            R${formatMoney.format(value)}
          </Text>
          <Text color="dimmed" size="xs">
            {format(date, 'dd/MM/yyyy')}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
