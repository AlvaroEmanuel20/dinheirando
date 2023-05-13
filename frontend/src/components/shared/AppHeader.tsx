import {
  ActionIcon,
  Avatar,
  Burger,
  Container,
  Group,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import ThemeToggle from './ThemeToggle';
import { useDisclosure } from '@mantine/hooks';
import AppDrawer from './AppDrawer';
import { IconBell } from '@tabler/icons-react';
import { ReactNode } from 'react';
import Link from 'next/link';
import useUser from '@/hooks/useUser';

export default function AppHeader({ children }: { children: ReactNode }) {
  const [opened, { toggle, open, close }] = useDisclosure(false);
  const label = opened ? 'Close navigation' : 'Open navigation';
  const { colorScheme } = useMantineColorScheme();

  const { userData, isLoadingUser, errorUser } = useUser();

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
              <Skeleton visible={isLoadingUser} radius="50%">
                <Avatar
                  src={userData?.avatar ? userData.avatar : null}
                  color="yellow.6"
                  radius="xl"
                />
              </Skeleton>
            </Link>
          </Group>
        </Group>

        <AppDrawer opened={opened} close={close} />

        {children}
      </Container>
    </>
  );
}
