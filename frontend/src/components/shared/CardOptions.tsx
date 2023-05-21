import { ActionIcon, Anchor, Group, Loader } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardOptions {
  editLink: string;
  onDelete: () => void;
  toggleOptions: ReactNode;
  isDeleting: boolean;
}

export default function CardOptions({
  editLink,
  onDelete,
  toggleOptions,
  isDeleting
}: CardOptions) {
  return (
    <Group spacing={10}>
      <Anchor component={Link} href={editLink}>
        <ActionIcon size="sm" variant="filled">
          <IconEdit size="1rem" />
        </ActionIcon>
      </Anchor>

      {!isDeleting && (
        <ActionIcon onClick={onDelete} variant="filled" size="sm" color="red">
          <IconTrash size="1rem" />
        </ActionIcon>
      )}

      {isDeleting && <Loader size="sm" color="red" />}

      {toggleOptions}
    </Group>
  );
}
