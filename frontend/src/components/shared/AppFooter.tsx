import { useStyles } from '@/hooks/useStyles';
import { ActionIcon, Anchor, Center, Container, Menu } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function AppFooter() {
  const { classes } = useStyles();

  return (
    <Container
      className={classes.appFooter}
      py={10}
      bg="gray.8"
      pos="fixed"
      bottom={0}
    >
      <Center pb={5}>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon
              mt={-30}
              color="yellow.6"
              variant="filled"
              radius="xl"
              size="xl"
              className={classes.appFooterBtn}
            >
              <IconPlus size="1.1rem" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Anchor
              underline={false}
              component={Link}
              href="/adicionar/transacao"
            >
              <Menu.Item icon={<IconPlus size={14} />}>Transação</Menu.Item>
            </Anchor>
            <Anchor
              underline={false}
              component={Link}
              href="/adicionar/categoria"
            >
              <Menu.Item icon={<IconPlus size={14} />}>Categoria</Menu.Item>
            </Anchor>
            <Anchor underline={false} component={Link} href="/adicionar/conta">
              <Menu.Item icon={<IconPlus size={14} />}>Conta</Menu.Item>
            </Anchor>
            <Anchor
              underline={false}
              component={Link}
              href="/adicionar/transferencia"
            >
              <Menu.Item icon={<IconPlus size={14} />}>Transferência</Menu.Item>
            </Anchor>
          </Menu.Dropdown>
        </Menu>
      </Center>
    </Container>
  );
}
