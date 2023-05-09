import { formatMoney } from '@/lib/formatMoney';
import { Card, Group, Text, useMantineColorScheme } from '@mantine/core';

interface AccountCard {
  name: string;
  amount: number;
}

export default function AccountCard({ name, amount }: AccountCard) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card withBorder p={10} bg={colorScheme === 'dark' ? 'gray.7' : 'white'}>
      <Group position="apart">
        <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
          {name}
        </Text>

        <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
          R${formatMoney.format(amount)}
        </Text>
      </Group>
    </Card>
  );
}
