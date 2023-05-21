import { formatMoney } from '@/lib/formatMoney';
import {
  ActionIcon,
  Card,
  Group,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import CardOptions from '../shared/CardOptions';
import { AccountId } from '@/lib/apiTypes/accounts';
import useSWRMutation from 'swr/mutation';
import { deleteService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface AccountCard {
  id: string;
  name: string;
  amount: number;
}

export default function AccountCard({ id, name, amount }: AccountCard) {
  const { colorScheme } = useMantineColorScheme();
  const [showOptions, setShowOptions] = useState(false);
  const handleShowOptions = () => setShowOptions(!showOptions);
  const ShowOptions = () => (
    <ActionIcon onClick={handleShowOptions}>
      <IconDotsVertical />
    </ActionIcon>
  );

  const { mutate } = useSWRConfig();

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation(`/accounts/${id}`, deleteService<AccountId>);

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/accounts')
      );
    } catch (error) {}
  };

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
            editLink={`/editar/conta/${id}`}
            toggleOptions={<ShowOptions />}
            isDeleting={isMutating}
            onDelete={onDelete}
          />
        )}
      </Group>
    </Card>
  );
}
