import { apiInstance } from '@/lib/apiInstance';
import { Button, FileInput, Loader, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';
import { useState } from 'react';

export default function UploadAvatar() {
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
