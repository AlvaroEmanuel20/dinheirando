import { formatMoney } from '@/lib/formatMoney';
import { Card, Progress, Text, useMantineColorScheme } from '@mantine/core';

interface GoalCard {
  bg: string;
  label: string;
  value: number;
  progress: {
    value: number;
    color: string;
  };
}

export default function GoalCard({ bg, label, value, progress }: GoalCard) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card padding="sm" bg={bg} h={120}>
      <Text size="sm" color={colorScheme === 'dark' ? 'white' : 'dark'}>
        {label}
      </Text>
      <Text weight="bold" color={colorScheme === 'dark' ? 'white' : 'dark'}>
        R${formatMoney.format(value)}
      </Text>

      <Progress
        value={progress.value}
        bg="gray.4"
        color={progress.color}
        mt="md"
        size="lg"
        radius="xl"
      />
    </Card>
  );
}
