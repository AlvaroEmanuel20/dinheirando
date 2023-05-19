import { formatMoney } from '@/lib/formatMoney';
import { ActionIcon, Card, Group, Text, useMantineColorScheme } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import CardOptions from '../shared/CardOptions';

interface AccountCard {
  name: string;
  amount: number;
}

export default function AccountCard({ name, amount }: AccountCard) {
  const { colorScheme } = useMantineColorScheme();
  const [showOptions, setShowOptions] = useState(false);
  const handleShowOptions = () => setShowOptions(!showOptions);
  const ShowOptions = () => (
    <ActionIcon onClick={handleShowOptions}>
      <IconDotsVertical />
    </ActionIcon>
  );

  const onDelete = () => console.log('excluei');

  return (
    <Card withBorder p={10} bg={colorScheme === 'dark' ? 'gray.7' : 'white'}>
      <Group position="apart">
        <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
          {name}
        </Text>

        {!showOptions && (
          <Group spacing={8}>
            <Text color={colorScheme === 'dark' ? 'white' : 'dark'} size="sm">
              R${formatMoney.format(amount)}
            </Text>
            <ShowOptions />
          </Group>
        )}

        {showOptions && (
          <CardOptions
            editLink="/editar/conta"
            toggleOptions={<ShowOptions />}
            handleShowOptions={handleShowOptions}
            onDelete={onDelete}
          />
        )}
      </Group>
    </Card>
  );
}
