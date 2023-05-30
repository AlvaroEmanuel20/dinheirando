import {
  ActionIcon,
  Avatar,
  Group,
  useMantineColorScheme,
} from '@mantine/core';
import Image from 'next/image';
import ThemeToggle from '../shared/ThemeToggle';
import { IconLogout } from '@tabler/icons-react';
import useAuth from '@/hooks/useAuth';

export default function AppHeader() {
  const { signOutAndRedirect, isLoadingSignOut } = useAuth();
  const { colorScheme } = useMantineColorScheme();

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

        <ActionIcon
          loading={isLoadingSignOut}
          sx={{ '&[data-loading]::before': { backgroundColor: 'transparent' } }}
          onClick={signOutAndRedirect}
          variant="transparent"
        >
          <IconLogout color="white" size="1.5rem" />
        </ActionIcon>

        <Avatar
          variant="filled"
          styles={(theme) => ({
            placeholder: {
              color: theme.colors.violet[6],
            },
          })}
          color={colorScheme === 'dark' ? 'dark.5' : 'gray.0'}
          radius="xl"
          alt=""
        >
          AE
        </Avatar>
      </Group>
    </Group>
  );
}
