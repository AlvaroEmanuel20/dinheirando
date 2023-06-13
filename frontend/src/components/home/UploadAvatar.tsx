import { apiInstance } from '@/lib/apiInstance';
import { updateAvatarSchema } from '@/lib/schemas/users';
import { Button, FileInput, Loader, Stack, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

export default function UploadAvatar() {
  const { mutate } = useSWRConfig();
  const [isUploading, setIsUploading] = useState(false);
  const formAvatar = useForm({
    validate: zodResolver(updateAvatarSchema),
    initialValues: {
      avatar: null,
    },
  });

  const uploadAvatar = async (avatar: File | null) => {
    setIsUploading(true);
    if (!avatar) return;

    try {
      const formData = new FormData();
      formData.append('file', avatar);
      await apiInstance.post('/avatars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await mutate(
        (key) => typeof key === 'string' && key.startsWith('/users')
      );
      setIsUploading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            color: 'red',
            title: 'Não foi possível processar seu upload',
            message:
              'Só são aceitas imagens com no máximo 500kb e com extensões jpeg, jpg e png',
          });
        } else {
          notifications.show({
            color: 'red',
            title: 'Erro inesperado',
            message: 'Houve um erro ao fazer upload do avatar',
          });
        }
      }

      setIsUploading(false);
    }
  };

  return (
    <Stack mt={20} spacing={10}>
      <Text weight="bold">Alterar Avatar</Text>

      <form
        encType="multipart/form-data"
        onSubmit={formAvatar.onSubmit(async (values) =>
          uploadAvatar(values.avatar)
        )}
      >
        <Stack spacing="sm">
          <FileInput
            clearable
            multiple={false}
            placeholder="Selecione a imagem"
            icon={<IconUpload size="0.8rem" />}
            accept="image/png,image/jpeg,image/jpg"
            styles={(theme) => ({
              input: {
                '&:focus-within': {
                  borderColor: theme.colors.violet[6],
                },
              },
            })}
            {...formAvatar.getInputProps('avatar')}
          />

          <Button
            color="violet.6"
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
    </Stack>
  );
}
