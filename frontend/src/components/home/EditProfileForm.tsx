import TextCustomInput from '@/components/shared/TextCustomInput';
import {
  Alert,
  Avatar,
  Button,
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
  IconUser,
} from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { updateUserSchema } from '@/lib/schemas/users';
import { User, UserId } from '@/lib/apiTypes/users';
import useSWRMutation from 'swr/mutation';
import { createService, updateService } from '@/lib/mutateServices';
import { useSWRConfig } from 'swr';
import getFirstLettersName from '@/lib/getFirstLettersName';
import UploadAvatar from './UploadAvatar';

interface UpdateUserValues {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

interface Arg {
  arg: UpdateUserValues;
}

export default function EditProfileForm({
  userData,
  isLoadingUser,
  onDelete,
  isDeleting,
}: {
  userData: User | undefined;
  isLoadingUser: boolean;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}) {
  const { mutate } = useSWRConfig();

  const {
    trigger: triggerUpdateUser,
    isMutating: isMutatingUser,
    error: errorMutateUser,
  } = useSWRMutation('/users', updateService<UserId, Arg>);

  const {
    trigger: triggerNewEmail,
    isMutating: isMutatingNewEmail,
    error: errorMutateNewEmail,
  } = useSWRMutation('/users/confirm/new', createService);

  const form = useForm({
    validate: zodResolver(updateUserSchema),
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      <Skeleton visible={isLoadingUser}>
        <Group>
          <Avatar
            src={userData && userData.avatar ? userData.avatarUrl : null}
            alt={userData?.name}
            color="violet.6"
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
          my={20}
          icon={<IconAlertCircle size="1rem" />}
          title="Aviso"
          color="violet.6"
          variant="outline"
        >
          <div>
            Seu email ainda não foi verificado. Verifique o email enviado por
            nós com as instruções para verificar seu email.
          </div>
          <Button
            loading={isMutatingNewEmail}
            onClick={async () => {
              try {
                await triggerNewEmail({});
              } catch (error) {}
            }}
            mt={8}
            compact
            color="violet.6"
          >
            Reenviar email
          </Button>
        </Alert>
      )}

      <UploadAvatar />

      <Stack mt={20} spacing={10}>
        <Text weight="bold">Alterar Perfil</Text>

        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              const valuesArr = Object.entries(values).filter(
                (value) => value[1] && value[1].length > 0
              );

              if (valuesArr.length === 0) return;
              await triggerUpdateUser(Object.fromEntries(valuesArr));

              await mutate(
                (key) => typeof key === 'string' && key.startsWith('/users')
              );
            } catch (error) {}
          })}
        >
          <Stack spacing="sm">
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

            <PasswordInput
              icon={<IconLock size="1rem" />}
              placeholder="Nova senha"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.violet[6],
                  },
                },
              })}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              icon={<IconLock size="1rem" />}
              placeholder="Confirme a nova senha"
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.violet[6],
                  },
                },
              })}
              {...form.getInputProps('confirmPassword')}
            />

            <Button type="submit" color="violet.6">
              {isMutatingUser ? (
                <Loader size="xs" variant="dots" color="white" />
              ) : (
                'Atualizar'
              )}
            </Button>

            {errorMutateUser && (
              <Text size="sm" color="red">
                {errorMutateUser.response.status === 409
                  ? 'Já existe uma conta com esse email'
                  : 'Error interno no servidor'}
              </Text>
            )}
          </Stack>
        </form>
      </Stack>

      <Group position="right" mt={20}>
        <Button
          loading={isDeleting}
          onClick={onDelete}
          variant="subtle"
          color="red"
        >
          Excluir conta
        </Button>
      </Group>
    </>
  );
}
