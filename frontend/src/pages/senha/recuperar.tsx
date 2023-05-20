import TextCustomInput from '@/components/shared/TextCustomInput';
import AuthLayout from '@/layouts/AuthLayout';
import { apiInstance } from '@/lib/apiInstance';
import { recoverPasswordSchema } from '@/lib/schemas/auth';
import { Container, Stack, Title, Button, Text, Loader } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

interface Arg {
  arg: {
    email: string;
  };
}

async function recoverPassword(url: string, { arg }: Arg) {
  return apiInstance.post(url, arg).then((res) => res.data);
}

export default function RecoverPassword() {
  const [successMsg, setSuccessMsg] = useState('');

  const {
    trigger,
    isMutating,
    error: errorMutate,
  } = useSWRMutation('/passwords/reset', recoverPassword, {
    onSuccess(data, key, config) {
      setSuccessMsg('Enviamos um email com as instruções para você.');
    },
  });

  const form = useForm({
    validate: zodResolver(recoverPasswordSchema),
    initialValues: {
      email: '',
    },
  });

  return (
    <>
      <AuthLayout>
        <Container mt={30}>
          <Title order={1} size="1.5rem" mb={15}>
            Recuperar senha
          </Title>

          <form
            onSubmit={form.onSubmit(async (values) => {
              try {
                await trigger(values);
              } catch (error) {}
            })}
          >
            <Stack spacing="sm">
              <TextCustomInput
                icon={<IconMail size="0.8rem" />}
                placeholder="exemplo@gmail.com"
                label="Email"
                withAsterisk
                {...form.getInputProps('email')}
              />

              <Button type="submit" color="yellow.6">
                {isMutating ? (
                  <Loader size="xs" variant="dots" color="white" />
                ) : (
                  'Enviar'
                )}
              </Button>

              {successMsg && (
                <Text size="sm" color="green">
                  {successMsg}
                </Text>
              )}

              {errorMutate && (
                <Text size="sm" color="red">
                  {errorMutate.response.status === 404
                    ? 'Usuário não encontrado'
                    : 'Erro interno no servidor'}
                </Text>
              )}
            </Stack>
          </form>
        </Container>
      </AuthLayout>
    </>
  );
}
