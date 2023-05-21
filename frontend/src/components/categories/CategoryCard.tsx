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
import useSWRMutation from 'swr/mutation';
import { CategoryId } from '@/lib/apiTypes/categories';
import { deleteService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';

interface CategoryCard {
  id: string;
  name: string;
  totalOfTransactions: number;
  type: 'income' | 'expense';
}

export default function CategoryCard({
  id,
  name,
  totalOfTransactions,
  type,
}: CategoryCard) {
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
  } = useSWRMutation(`/categories/${id}`, deleteService<CategoryId>);

  const onDelete = async () => {
    try {
      await trigger();
      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/categories')
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
            <Text color={type === 'income' ? 'green' : 'red'} size="sm">
              R${formatMoney.format(totalOfTransactions)}
            </Text>
            <ShowOptions />
          </Group>
        )}

        {showOptions && (
          <CardOptions
            editLink={`/editar/categoria/${id}`}
            toggleOptions={<ShowOptions />}
            onDelete={onDelete}
            isDeleting={isMutating}
          />
        )}
      </Group>
    </Card>
  );
}
