import { formatMoney } from '@/lib/formatMoney';
import { Card, Text } from '@mantine/core';

interface TotalCard {
  bg: string;
  label: string;
  value: number;
}

export default function TotalCard({ bg, label, value }: TotalCard) {
  return (
    <Card padding="sm" bg={bg} w={150} h={80}>
      <Text size="sm" color="white">
        {label}
      </Text>
      <Text weight="bold" color="white">
        R${formatMoney.format(value)}
      </Text>
    </Card>
  );
}
