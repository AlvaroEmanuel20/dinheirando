import { ActionIcon, Avatar, Group } from '@mantine/core';
import Image from 'next/image';
import ThemeToggle from '../shared/ThemeToggle';
import { IconLogout } from '@tabler/icons-react';
import useAuth from '@/hooks/useAuth';

export default function AppHeader() {
  const { signOutAndRedirect } = useAuth();

  return (
    <Group position="apart">
      <Image
        src="/logo-white.svg"
        alt="Logo Dinheirando"
        width={175}
        height={31}
      />

      <Group spacing={20}>
        <ThemeToggle size="1.5rem" color="gray.0" />

        <ActionIcon onClick={signOutAndRedirect} variant="transparent">
          <IconLogout color="white" size="1.5rem" />
        </ActionIcon>

        <Avatar color="violet.6" radius="xl">
          AE
        </Avatar>
      </Group>
    </Group>
  );
}
