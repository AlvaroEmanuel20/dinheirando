import AuthLayout from '@/layouts/AuthLayout';
import {
  Button,
  Container,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useRouter } from 'next/router';

export default function Custom404() {
  const { colorScheme } = useMantineColorScheme();
  const router = useRouter();

  return (
    <>
      <AuthLayout>
        <Container>
          <Stack spacing={0}>
            <Title
              fw={900}
              size="5rem"
              align="center"
              mt={40}
              color={colorScheme === 'dark' ? 'dark.4' : 'gray.2'}
            >
              404
            </Title>
            <Title align="center" size="1.8rem">
              Página não encontrada.
            </Title>
            <Text my={20} align="center" color="dimmed">
              Tente digitar corretamente ou talvez essa página não exista mais.
            </Text>
            <Button color="yellow.6" onClick={() => router.back()}>
              Voltar
            </Button>
          </Stack>
        </Container>
      </AuthLayout>
    </>
  );
}
