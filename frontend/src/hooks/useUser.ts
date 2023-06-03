import { fetcher } from '@/lib/apiInstance';
import { User } from '@/lib/apiTypes/users';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';

export default function useUser(isDeletingUser?: boolean) {
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useSWR<User>('/users', fetcher, {
    onError(err, key, config) {
      if (!isDeletingUser) {
        notifications.show({
          color: 'red',
          title: 'Erro inesperado',
          message: 'Houve um erro ao carregar informações do usuário',
        });
      }
    },
  });
  return { userData, isLoadingUser, errorUser };
}
