import { formatMoney } from '@/lib/formatMoney';
import { ActionIcon, Group, Stack, Text, rem } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

export default function TotalCardTransparent({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const [show, setShow] = useState(true);

  return (
    <Stack spacing={0}>
      <Group spacing={12}>
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
        size={rem(25)}
      >
        R${formatMoney.format(value)}
      </Text>
    </Stack>
  );
}
