import {
  ActionIcon,
  Avatar,
  Box,
  Drawer,
  Group,
  MediaQuery,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import Image from 'next/image';
import ThemeToggle from '../shared/ThemeToggle';
import { IconLogout } from '@tabler/icons-react';
import useAuth from '@/hooks/useAuth';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import useUser from '@/hooks/useUser';
import getFirstLettersName from '@/lib/getFirstLettersName';
import { useDisclosure } from '@mantine/hooks';
import EditProfileForm from './EditProfileForm';

export default function AppHeader() {
  const { signOutAndRedirect, isLoadingSignOut } = useAuth();
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStylesHome();
  const { userData, isLoadingUser, errorUser } = useUser();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Group position="apart" className={classes.paddingRightXs}>
        <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
          <Image
            src="/logo-white.svg"
            alt="Logo Dinheirando"
            width={175}
            height={31}
          />
        </MediaQuery>

        <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
          <Image
            src="/logo-mobile.svg"
            alt="Logo Dinheirando"
            width={35}
            height={35}
          />
        </MediaQuery>

        <Group spacing={20} className={classes.appHeaderRightSide}>
          <ThemeToggle size="1.5rem" color="gray.0" />

          <ActionIcon
            loading={isLoadingSignOut}
            sx={{
              '&[data-loading]::before': { backgroundColor: 'transparent' },
            }}
            onClick={signOutAndRedirect}
            variant="transparent"
          >
            <IconLogout color="white" size="1.5rem" />
          </ActionIcon>

          <Box>
            <Skeleton radius="100%" visible={isLoadingUser}>
              <Avatar
                sx={{ cursor: 'pointer' }}
                onClick={open}
                variant="filled"
                styles={(theme) => ({
                  placeholder: {
                    color: theme.colors.violet[6],
                  },
                })}
                color={colorScheme === 'dark' ? 'dark.5' : 'gray.0'}
                radius="xl"
                src={userData ? userData.avatar : null}
                alt={userData?.name}
              >
                {userData && getFirstLettersName(userData.name).join('')}
              </Avatar>
            </Skeleton>
          </Box>
        </Group>
      </Group>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Editar Perfil"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <EditProfileForm userData={userData} isLoadingUser={isLoadingUser} />
      </Drawer>
    </>
  );
}
