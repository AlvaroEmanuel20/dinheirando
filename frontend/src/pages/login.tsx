import GoogleIcon from "@/components/auth/GoogleIcon";
import TextCustomInput from "@/components/shared/TextCustomInput";
import AuthLayout from "@/layouts/AuthLayout";
import { loginSchema } from "@/lib/schemas/auth";
import {
  Container,
  Stack,
  Title,
  PasswordInput,
  Button,
  Center,
  Text,
  Anchor,
  Loader,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconLock, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface Values {
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    validate: zodResolver(loginSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <AuthLayout>
        <Container mt={30}>
          <Title order={1} size="1.5rem" mb={15}>
            Login
          </Title>

          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stack spacing="sm">
              <TextCustomInput
                icon={<IconMail size="0.8rem" />}
                placeholder="exemplo@gmail.com"
                label="Email"
                withAsterisk
                {...form.getInputProps("email")}
              />

              <PasswordInput
                icon={<IconLock size="1rem" />}
                placeholder="Sua senha"
                label="Senha"
                withAsterisk
                styles={(theme) => ({
                  input: {
                    "&:focus-within": {
                      borderColor: theme.colors.yellow[5],
                    },
                  },
                })}
                {...form.getInputProps("password")}
              />

              <Button type="submit" color="yellow.6">
                {isLoading ? (
                  <Loader size="xs" variant="dots" color="white" />
                ) : (
                  "Entrar"
                )}
              </Button>

              {error && (
                <Text size="sm" color="red">
                  {error}
                </Text>
              )}
            </Stack>
          </form>

          <Center my={15}>
            <Text size="sm" color="dimmed">
              Ou entre com
            </Text>
          </Center>

          <Button
            fullWidth
            leftIcon={<GoogleIcon />}
            variant="default"
            color="gray"
          >
            Google
          </Button>

          <Text mt={15} size="sm" color="dimmed">
            Não tem uma conta?{" "}
            <Anchor
              component={Link}
              weight="bold"
              color="dimmed"
              href="cadastro"
            >
              Cadastre-se
            </Anchor>
          </Text>
        </Container>
      </AuthLayout>
    </>
  );
}
