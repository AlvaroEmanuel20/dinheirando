import { formatMoney } from '@/lib/formatMoney';
import {
  ActionIcon,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

interface TotalCard {
  label: string;
  value: number;
}

export default function TotalCard({ label, value }: TotalCard) {
  const [show, setShow] = useState(true);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card
      p={12}
      bg={colorScheme === 'dark' ? 'violet.6' : ''}
      sx={{
        background: 'rgba(255, 255, 255, 0.24)',
        backdropFilter: 'blur(0.2px)',
      }}
      radius="6px"
    >
      <Stack spacing={0}>
        <Group position="apart">
          <Text color="white" size="sm">
            {label}
          </Text>

          <ActionIcon variant="transparent" onClick={() => setShow(!show)}>
            {show ? (
              <IconEye color="white" size="1.1rem" />
            ) : (
              <IconEyeOff color="white" size="1.1rem" />
            )}
          </ActionIcon>
        </Group>

        <Text
          sx={{ filter: show ? 'none' : 'blur(0.4rem)' }}
          color="white"
          fw="bold"
          size="xl"
        >
          R${formatMoney.format(value)}
        </Text>
      </Stack>
    </Card>
  );
}
