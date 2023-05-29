import {
  Container,
  Group,
  useMantineColorScheme,
  Title,
  Text,
  Anchor,
  Box,
} from '@mantine/core';
import { ReactNode } from 'react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useStyles } from '@/hooks/useStyles';

interface AuthLayout {
  children: ReactNode;
  title: string;
  auxLink?: {
    text: string;
    textLink: string;
    link: string;
  };
}

export default function AuthLayout({ children, title, auxLink }: AuthLayout) {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();

  return (
    <Box pb={40}>
      <Container px={20} py={50}>
        <Group position="apart">
          <Image
            src={
              colorScheme === 'dark' ? '/logo-white.svg' : '/logo-violet.svg'
            }
            alt="Logo Dinheirando"
            width={175}
            height={31}
          />

          <ThemeToggle />
        </Group>
      </Container>

      <Container size="xs" mt={80} className={classes.authFormContainer}>
        <Group position="apart">
          <Title order={1} size="1.5rem">
            {title}
          </Title>

          {auxLink && (
            <Text size="sm" color="dimmed">
              {auxLink.text}{' '}
              <Anchor
                component={Link}
                weight="bold"
                color="dimmed"
                href={auxLink.link}
              >
                {auxLink.textLink}
              </Anchor>
            </Text>
          )}
        </Group>
      </Container>

      {children}
    </Box>
  );
}
