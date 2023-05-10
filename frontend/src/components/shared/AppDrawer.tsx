import useAuth from '@/hooks/useAuth';
import {
  Anchor,
  Button,
  Divider,
  Drawer,
  Group,
  Loader,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconArrowsTransferUp,
  IconCreditCard,
  IconHome2,
  IconSettings2,
  IconTags,
  IconWallet,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface AppDrawer {
  opened: boolean;
  close: () => void;
}

export default function AppDrawer({ opened, close }: AppDrawer) {
  const { data: session } = useSession();
  const { signOutAndRedirect, isLoadingSignOut } = useAuth();
  const { colorScheme } = useMantineColorScheme();

  const links = [
    {
      href: '/',
      icon: <IconHome2 />,
      label: 'Home',
    },
    {
      href: '/transacoes',
      icon: <IconCreditCard />,
      label: 'Transações',
    },
    {
      href: '/categorias',
      icon: <IconTags />,
      label: 'Categorias',
    },
    {
      href: '/carteira',
      icon: <IconWallet />,
      label: 'Carteira',
    },
    {
      href: '/preferencias',
      icon: <IconSettings2 />,
      label: 'Preferências',
    },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Menu"
      overlayProps={{ opacity: 0.5, blur: 4 }}
    >
      <Stack>
        {links.map((link) => (
          <Anchor
            key={link.href}
            component={Link}
            color={colorScheme === 'dark' ? 'white' : 'dark'}
            href={link.href}
          >
            <Group>
              {link.icon}
              <Text>{link.label}</Text>
            </Group>
          </Anchor>
        ))}
      </Stack>

      <Divider mt={30} mb={15} />

      <Stack>
        {session && session.user ? (
          <Button onClick={signOutAndRedirect} color="yellow.6">
            {isLoadingSignOut ? (
              <Loader size="xs" variant="dots" color="white" />
            ) : (
              'Sair'
            )}
          </Button>
        ) : (
          <Button
            component={Link}
            href="/login"
            onClick={close}
            color="yellow.6"
          >
            Login
          </Button>
        )}
      </Stack>
    </Drawer>
  );
}
