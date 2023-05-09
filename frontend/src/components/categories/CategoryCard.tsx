import { Card, Group, Text, useMantineColorScheme } from '@mantine/core';

interface CategoryCard {
  name: string;
  qtyTransactions: number;
  type: 'income' | 'expense';
}

export default function CategoryCard({
  name,
  qtyTransactions,
  type,
}: CategoryCard) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card withBorder p={10} bg={colorScheme === 'dark' ? 'gray.7' : 'white'}>
      <Group position="apart">
        <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
          {name}
        </Text>

        <Text color={type === 'income' ? 'green' : 'red'} size="sm">
          {qtyTransactions}
        </Text>
      </Group>
    </Card>
  );
}
