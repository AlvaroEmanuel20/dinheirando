import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
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
import getFirstLettersName from '@/lib/getFirstLettersName';
import { useStyles } from '@/hooks/useStyles';

export default function AppHeader({ children }: { children: ReactNode }) {
  const [opened, { toggle, open, close }] = useDisclosure(false);
  const label = opened ? 'Close navigation' : 'Open navigation';
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  const { userData, isLoadingUser, errorUser } = useUser();

  return (
    <>
      <Container
        className={classes.container}
        py={30}
        bg={colorScheme === 'dark' ? 'gray.9' : 'gray.8'}
      >
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

            <Anchor
              component={Link}
              sx={{
                '&:hover': {
                  textDecoration: 'none',
                },
                '&:active': {
                  textDecoration: 'none',
                },
              }}
              href="/preferencias"
            >
              <Skeleton visible={isLoadingUser} radius="50%">
                <Avatar
                  src={userData ? userData.avatar : null}
                  alt={userData?.name}
                  color="yellow.6"
                  radius="xl"
                >
                  {userData && getFirstLettersName(userData.name).join('')}
                </Avatar>
              </Skeleton>
            </Anchor>
          </Group>
        </Group>

        <AppDrawer opened={opened} close={close} />

        <Box className={classes.innerAppHeader}>{children}</Box>
      </Container>
    </>
  );
}
