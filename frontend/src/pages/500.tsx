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

export default function Custom500() {
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
              500
            </Title>
            <Title align="center" size="1.8rem">
              Erro interno no servidor.
            </Title>
            <Text my={20} align="center" color="dimmed">
              Houve um erro inesperado no servidor tente novamente mais tarde.
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
