import { ActionIcon, Center, Container, Menu, useMantineColorScheme } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function AppFooter() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Container w="100%" py={10} bg="gray.8" pos="fixed" bottom={0}>
      <Center pb={5}>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon
              mt={-30}
              color="yellow.6"
              variant="filled"
              radius="xl"
              size="xl"
            >
              <IconPlus size="1.1rem" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconPlus size={14} />}>Transação</Menu.Item>
            <Menu.Item icon={<IconPlus size={14} />}>Categoria</Menu.Item>
            <Menu.Item icon={<IconPlus size={14} />}>Conta</Menu.Item>
            <Menu.Item icon={<IconPlus size={14} />}>Transferência</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Center>
    </Container>
  );
}
