import { ActionIcon, Center, Stack } from '@mantine/core';
import { IconMoodEmptyFilled } from '@tabler/icons-react';
import Link from 'next/link';

interface NoData {
  link: string;
  color?: string;
  text: string;
}

export default function NoData({ link, color, text }: NoData) {
  return (
    <Center>
      <Stack spacing={5} align="center">
        <ActionIcon
          component={Link}
          href={link}
          color={color ? color : 'yellow.6'}
          variant="filled"
          size="xl"
          radius="50%"
        >
          <IconMoodEmptyFilled size="1.4rem" />
        </ActionIcon>
        {text}
      </Stack>
    </Center>
  );
}
