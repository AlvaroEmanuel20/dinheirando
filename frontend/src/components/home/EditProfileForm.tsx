import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  Alert,
  Avatar,
  Button,
  FileInput,
  Group,
  Loader,
  PasswordInput,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconLock,
  IconMail,
  IconUpload,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';
import useUser from '@/hooks/useUser';
import { useForm, zodResolver } from '@mantine/form';
import { updatePasswordSchema, updateUserSchema } from '@/lib/schemas/users';
import { UserId } from '@/lib/apiTypes/users';
import useSWRMutation from 'swr/mutation';
import { updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';
import { apiInstance } from '@/lib/apiInstance';
import getFirstLettersName from '@/lib/getFirstLettersName';

interface Arg {
  arg: {
    name: string;
    email: string;
  };
}

interface ArgPassword {
  arg: {
    password: string;
    confirmPassword: string;
  };
}

interface PreferencesProps {
  userForm: {
    name: string;
    email: string;
  };
}

export default function EditProfileForm() {
  const [emailWasUpdated, setEmailWasUpdated] = useState(false);
  const { userData, isLoadingUser } = useUser();
  const { mutate } = useSWRConfig();

  const {
    trigger: triggerUpdateUser,
    isMutating: isMutatingUser,
    error: errorMutateUser,
  } = useSWRMutation('/users', updateService<UserId, Arg>);

  const {
    trigger: triggerUpdatePassword,
    isMutating: isMutatingPassword,
    error: errorMutatePassword,
  } = useSWRMutation('/users', updateService<UserId, ArgPassword>);

  const form = useForm({
    validate: zodResolver(updateUserSchema),
    initialValues: {
      name: '',
      email: '',
    },
  });

  const formPassword = useForm({
    validate: zodResolver(updatePasswordSchema),
    initialValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');
  const formAvatar = useForm({
    initialValues: {
      avatar: null,
    },
    validate: {
      avatar: (value) => (value === null ? 'Campo obrigatório' : null),
    },
  });

  const uploadAvatar = async (avatar: File | null) => {
    setIsUploading(true);
    if (!avatar) return;

    try {
      const formData = new FormData();
      formData.append('file', avatar);
      const res = await apiInstance.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res);
      setIsUploading(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

  return (
    <>
      <Skeleton visible={isLoadingUser}>
        <Group>
          <Avatar
            src={userData ? userData.avatar : null}
            alt={userData?.name}
            color="yellow.6"
            size="lg"
            radius="xl"
          >
            {userData && getFirstLettersName(userData.name).join('')}
          </Avatar>

          <Stack spacing={0}>
            <Text size="sm" weight="bold">
              {userData?.name}
            </Text>
            <Text size="sm" color="dimmed">
              {userData?.email}
            </Text>
          </Stack>
        </Group>
      </Skeleton>

      {userData && !userData.isVerified && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Aviso"
          color="yellow"
          variant="outline"
        >
          Seu email ainda não foi verificado. Verifique o email enviado por nós
          com as instruções para verificar seu email.
          <Button compact mt={8} color="yellow.6">
            Reenviar email
          </Button>
        </Alert>
      )}

      <Text weight="bold">Alterar avatar</Text>

      <form
        encType="multipart/form-data"
        onSubmit={formAvatar.onSubmit(async (values) =>
          uploadAvatar(values.avatar)
        )}
      >
        <Stack spacing="sm" mt={10}>
          <FileInput
            clearable
            multiple={false}
            placeholder="Selecione a imagem"
            icon={<IconUpload size="0.8rem" />}
            accept="image/png,image/jpeg,image/jpg"
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.yellow[5],
                },
              },
            })}
            {...formAvatar.getInputProps('avatar')}
          />

          <Button
            color="yellow.6"
            type="submit"
            leftIcon={<IconUpload size="1rem" />}
          >
            {isUploading ? (
              <Loader size="xs" variant="dots" color="white" />
            ) : (
              'Enviar'
            )}
          </Button>
        </Stack>
      </form>

      <Text weight="bold">Alterar perfil</Text>

      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            await triggerUpdateUser(values);

            await mutate(
              (key) => typeof key === 'string' && key.startsWith('/users')
            );

            if (values.email.length > 0) setEmailWasUpdated(true);
          } catch (error) {}
        })}
      >
        <Stack spacing="sm" mt={10}>
          <TextCustomInput
            icon={<IconUser size="0.8rem" />}
            placeholder="Seu nome"
            {...form.getInputProps('name')}
          />

          <TextCustomInput
            icon={<IconMail size="0.8rem" />}
            placeholder="Seu email"
            {...form.getInputProps('email')}
          />

          <Button type="submit" color="yellow.6">
            {isMutatingUser ? (
              <Loader size="xs" variant="dots" color="white" />
            ) : (
              'Alterar'
            )}
          </Button>

          {errorMutateUser && (
            <Text size="sm" color="red">
              {errorMutateUser.response.status === 409
                ? 'Já existe uma conta com esse email'
                : 'Error interno no servidor'}
            </Text>
          )}

          {!errorMutateUser && emailWasUpdated && (
            <Text size="sm" color="green">
              Enviamos um email de confirmação para você
            </Text>
          )}
        </Stack>
      </form>

      <Text weight="bold">Alterar senha</Text>

      <form
        onSubmit={formPassword.onSubmit(async (values) => {
          try {
            await triggerUpdatePassword(values);
          } catch (error) {}
        })}
      >
        <Stack spacing="sm" mt={10}>
          <PasswordInput
            icon={<IconLock size="1rem" />}
            placeholder="Nova senha"
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.yellow[5],
                },
              },
            })}
            {...formPassword.getInputProps('password')}
          />

          <PasswordInput
            icon={<IconLock size="1rem" />}
            placeholder="Confirme a nova senha"
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.yellow[5],
                },
              },
            })}
            {...formPassword.getInputProps('confirmPassword')}
          />

          <Button type="submit" color="yellow.6">
            {isMutatingPassword ? (
              <Loader size="xs" variant="dots" color="white" />
            ) : (
              'Alterar'
            )}
          </Button>

          {errorMutatePassword && (
            <Text size="sm" color="red">
              Error interno no servidor
            </Text>
          )}
        </Stack>
      </form>

      <Group grow spacing={10} mt={10}>
        <Button disabled color="yellow.6">
          Salvar
        </Button>
        <Button variant="subtle" color="red">
          Excluir conta
        </Button>
      </Group>
    </>
  );
}
