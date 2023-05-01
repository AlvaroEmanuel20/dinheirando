import GoogleIcon from "@/components/auth/GoogleIcon";
import TextCustomInput from "@/components/shared/TextCustomInput";
import AuthLayout from "@/layouts/AuthLayout";
import { loginSchema, signUpSchema } from "@/lib/schemas/auth";
import {
  Container,
  Stack,
  Title,
  PasswordInput,
  Button,
  Center,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { useState } from "react";

interface Values {
  name?: string;
  email: string;
  password: string;
}

export default function Home() {
  const [login, setLogin] = useState(true);
  const handleAuthLayout = () => setLogin(!login);

  const form = useForm({
    validate: zodResolver(login ? loginSchema : signUpSchema),
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: Values) => {
    if (login) {
      values = {
        email: values.email,
        password: values.password,
      };
    }

    console.log(values);
  };

  return (
    <>
      <AuthLayout>
        <Container mt={30}>
          <Title order={1} size="1.5rem" mb={15}>
            {login ? "Login" : "Cadastro"}
          </Title>

          <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Stack spacing="sm">
              {!login && (
                <TextCustomInput
                  icon={<IconUser size="0.8rem" />}
                  placeholder="Seu nome"
                  label="Nome"
                  withAsterisk
                  {...form.getInputProps("name")}
                />
              )}

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
                {login ? "Entrar" : "Criar Conta"}
              </Button>
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
            {login ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <Text span weight="bold" onClick={handleAuthLayout}>
              {login ? "Cadastre-se" : "Entre"}
            </Text>
          </Text>
        </Container>
      </AuthLayout>
    </>
  );
}
