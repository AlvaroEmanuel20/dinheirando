import { ActionIcon, Card } from '@mantine/core';
import { IconAppsFilled } from '@tabler/icons-react';
import Link from 'next/link';

export default function NewItemCard({ link }: { link: string }) {
  return (
    <Card
      component={Link}
      href={link}
      radius="6px"
      bg="none"
      display="flex"
      sx={{
        border: '1px dashed #868E96',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActionIcon
        sx={{ '&:hover': { background: 'none' } }}
        variant="outline"
        size="xl"
        radius="xl"
      >
        <IconAppsFilled size="1.5rem" />
      </ActionIcon>
    </Card>
  );
}
