import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="transparent"
      color={dark ? 'gray' : 'dark'}
      onClick={() => toggleColorScheme()}
      title="Alterar tema entre escuro e claro"
    >
      {dark ? <IconSun size="1.5rem" /> : <IconMoonStars size="1.5rem" />}
    </ActionIcon>
  );
}
