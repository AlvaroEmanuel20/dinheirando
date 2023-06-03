import { ActionIcon, Card } from '@mantine/core';
import { IconAppsFilled } from '@tabler/icons-react';

export default function NewItemCard({
  height,
  openModal,
}: {
  height?: number;
  openModal: () => void;
}) {
  return (
    <Card
      onClick={openModal}
      radius="6px"
      h={height}
      bg="none"
      display="flex"
      sx={{
        border: '1px dashed #868E96',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
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
