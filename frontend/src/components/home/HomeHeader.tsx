import { ActionIcon, Avatar, Burger, Container, Group } from '@mantine/core';
import ThemeToggle from '../shared/ThemeToggle';
import { useDisclosure } from '@mantine/hooks';
import AppDrawer from '../shared/AppDrawer';
import { IconBell } from '@tabler/icons-react';
import { ReactNode } from 'react';

export default function HomeHeader({ children }: { children: ReactNode }) {
  const [opened, { toggle, open, close }] = useDisclosure(false);
  const label = opened ? 'Close navigation' : 'Open navigation';

  return (
    <>
      <Container py={30} bg="gray.8">
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

            <Avatar src="/profile.jpg" color="yellow.6" radius="xl" />
          </Group>
        </Group>

        <AppDrawer opened={opened} close={close} />

        {children}
      </Container>
    </>
  );
}
