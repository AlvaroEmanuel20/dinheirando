import { ActionIcon, Card, Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconTags, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

interface CategoryCard {
  name: string;
  type: 'income' | 'expense';
}

export default function CategoryCard({ name, type }: CategoryCard) {
  const [options, setOptions] = useState(false);

  return (
    <Card
      h={95}
      radius="6px"
      px={12}
      py={14}
      sx={{
        borderTop: `4px solid ${type === 'income' ? '#087F5B' : '#FA5252'}`,
      }}
    >
      <Stack spacing={5}>
        <Group spacing={12}>
          <ActionIcon
            onClick={() => setOptions(!options)}
            variant="filled"
            color={type === 'income' ? 'teal.9' : 'red'}
            radius="xl"
          >
            <IconTags size="1rem" />
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

        <Text size="sm" fw="bold" color="gray.7">
          {name}
        </Text>
      </Stack>
    </Card>
  );
}
