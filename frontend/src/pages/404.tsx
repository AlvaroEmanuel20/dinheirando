import {
  Box,
  Button,
  Center,
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
      <Box mih="100vh" bg={colorScheme === 'dark' ? 'dark.7' : 'violet.6'}>
        <Container>
          <Center mih="100vh">
            <Stack spacing={0} align="center">
              <Title
                fw={900}
                size="5rem"
                align="center"
                mt={40}
                color={colorScheme === 'dark' ? 'gray.0' : 'gray.2'}
              >
                404
              </Title>

              <Title align="center" size="1.8rem" color='gray.0'>
                Página não encontrada.
              </Title>

              <Text my={10} align="center" color="gray.0">
                Tente digitar corretamente ou talvez essa página não exista
                mais.
              </Text>

              <Box>
                <Button color="violet.6" onClick={() => router.back()}>
                  Voltar
                </Button>
              </Box>
            </Stack>
          </Center>
        </Container>
      </Box>
    </>
  );
}
