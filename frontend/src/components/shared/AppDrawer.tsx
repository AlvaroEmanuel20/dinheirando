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

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title="Menu"
      overlayProps={{ opacity: 0.5, blur: 4 }}
    >
      <Stack>
        <Anchor component={Link} color="dark" href="/">
          <Group>
            <IconHome2 />
            <Text>Home</Text>
          </Group>
        </Anchor>

        <Anchor component={Link} color="dark" href="/transacoes">
          <Group>
            <IconCreditCard />
            <Text>Transações</Text>
          </Group>
        </Anchor>

        <Anchor component={Link} color="dark" href="/categorias">
          <Group>
            <IconTags />
            <Text>Categorias</Text>
          </Group>
        </Anchor>

        <Anchor component={Link} color="dark" href="/contas">
          <Group>
            <IconWallet />
            <Text>Contas</Text>
          </Group>
        </Anchor>

        <Anchor component={Link} color="dark" href="/transferencias">
          <Group>
            <IconArrowsTransferUp />
            <Text>Transferências</Text>
          </Group>
        </Anchor>

        <Anchor component={Link} color="dark" href="/preferencias">
          <Group>
            <IconSettings2 />
            <Text>Preferências</Text>
          </Group>
        </Anchor>
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
