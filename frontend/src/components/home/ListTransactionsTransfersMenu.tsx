import {
  Group,
  MediaQuery,
  Menu,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconArrowsLeftRight,
  IconCash,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface ListTransactionsTransfersMenu {
  menuSelected: 'transactions' | 'transfers';
  setMenuSelected: Dispatch<SetStateAction<'transactions' | 'transfers'>>;
}

export default function ListTransactionsTransfersMenu({
  menuSelected,
  setMenuSelected,
}: ListTransactionsTransfersMenu) {
  const [opened, setOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      shadow="md"
      trigger="hover"
      openDelay={100}
      closeDelay={400}
    >
      <Menu.Target>
        <Group sx={{ cursor: 'pointer' }} spacing={10}>
          <MediaQuery smallerThan="xss" styles={{ display: 'none' }}>
            {menuSelected === 'transactions' ? (
              <IconCash size="1.56rem" color="#ADB5BD" />
            ) : (
              <IconArrowsLeftRight size="1.45rem" color="#ADB5BD" />
            )}
          </MediaQuery>

          <Text fw="bold" color={colorScheme === 'dark' ? 'gray.0' : 'dimmed'}>
            {menuSelected === 'transactions' ? 'Transações' : 'Transferências'}
          </Text>

          {opened ? (
            <IconChevronUp color="#ADB5BD" size="1rem" />
          ) : (
            <IconChevronDown size="1rem" color="#ADB5BD" />
          )}
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => setMenuSelected('transactions')}>
          Transações
        </Menu.Item>
        <Menu.Item onClick={() => setMenuSelected('transfers')}>
          Transferências
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
