import {
  ActionIcon,
  Avatar,
  Burger,
  Container,
  Group,
  useMantineColorScheme,
} from '@mantine/core';
import ThemeToggle from './ThemeToggle';
import { useDisclosure } from '@mantine/hooks';
import AppDrawer from './AppDrawer';
import { IconBell } from '@tabler/icons-react';
import { ReactNode } from 'react';
import Link from 'next/link';

export default function AppHeader({ children }: { children: ReactNode }) {
  const [opened, { toggle, open, close }] = useDisclosure(false);
  const label = opened ? 'Close navigation' : 'Open navigation';
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Container py={30} bg={colorScheme === 'dark' ? 'gray.9' : 'gray.8'}>
        <Group position="apart">
          <Burger
            color="white"
            opened={opened}
            onClick={toggle}
            aria-label={label}
          />

          <Group spacing={10}>
            <ActionIcon variant="filled" color="yellow.6">
              <IconBell size="1.1rem" />
            </ActionIcon>

            <ThemeToggle />

            <Link href="/preferencias">
              <Avatar src="/profile.jpg" color="yellow.6" radius="xl" />
            </Link>
          </Group>
        </Group>

        <AppDrawer opened={opened} close={close} />

        {children}
      </Container>
    </>
  );
}
