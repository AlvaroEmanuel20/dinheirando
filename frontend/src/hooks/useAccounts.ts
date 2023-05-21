import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';

export default function useAccounts<T>(id?: string) {
  let url = '/accounts';
  if (id) url = `${url}/${id}`;
  const result = useSWR<T>(url, fetcher, {
    onError(err, key, config) {
      notifications.show({
        color: 'red',
        title: 'Erro inesperado',
        message: 'Houve um erro ao carregar as contas',
      });
    },
  });
  return result;
}
