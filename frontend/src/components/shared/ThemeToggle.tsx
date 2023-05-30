import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

interface ThemeToggle {
  size: string;
  color: string;
}

export default function ThemeToggle({ size, color }: ThemeToggle) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="transparent"
      color={color}
      onClick={() => toggleColorScheme()}
      title="Alterar tema entre escuro e claro"
    >
      {dark ? <IconSun size={size} /> : <IconMoonStars size={size} />}
    </ActionIcon>
  );
}
