import { formatMoney } from '@/lib/formatMoney';
import { ActionIcon, Card, Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash, IconWallet } from '@tabler/icons-react';
import { useState } from 'react';

interface WalletCard {
  name: string;
  amount: number;
}

export default function WalletCard({ name, amount }: WalletCard) {
  const [options, setOptions] = useState(false);

  return (
    <Card
      h={130}
      radius="6px"
      px={12}
      py={16}
      sx={{ borderTop: '4px solid #ADB5BD' }}
    >
      <Stack spacing={5}>
        <Group spacing={12}>
          <ActionIcon
            onClick={() => setOptions(!options)}
            variant="filled"
            color="gray.6"
            radius="xl"
          >
            <IconWallet size="1rem" />
          </ActionIcon>

          {options && (
            <Group spacing={8}>
              <ActionIcon size="xs" variant="transparent" color="gray.6">
                <IconEdit size="1rem" />
              </ActionIcon>

              <ActionIcon size="xs" variant="transparent" color="red">
                <IconTrash size="1rem" />
              </ActionIcon>
            </Group>
          )}
        </Group>

        <Stack spacing={0}>
          <Text color="gray.7">{name}</Text>
          <Text color="gray.7" fw="bold">
            R${formatMoney.format(amount)}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
