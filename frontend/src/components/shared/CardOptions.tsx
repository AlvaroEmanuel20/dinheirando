import { ActionIcon, Anchor, Group } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardOptions {
  handleShowOptions: () => void;
  editLink: string;
  onDelete: () => void;
  toggleOptions: ReactNode;
}

export default function CardOptions({
  editLink,
  onDelete,
  toggleOptions,
}: CardOptions) {
  return (
    <Group spacing={10}>
      <Anchor component={Link} href={editLink}>
        <ActionIcon size="sm" variant="filled">
          <IconEdit size="1rem" />
        </ActionIcon>
      </Anchor>

      <ActionIcon onClick={onDelete} variant="filled" size="sm" color="red">
        <IconTrash size="1rem" />
      </ActionIcon>

      {toggleOptions}
    </Group>
  );
}
