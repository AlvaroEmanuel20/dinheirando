import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';

interface UseTransactions {
  id?: string;
  limit?: number;
  sort?: string | null;
  type?: string | null;
}

export default function useTransactions<T>({
  id,
  limit,
  sort,
  type,
}: UseTransactions) {
  let url = '/transactions';
  if (id) url = `${url}/${id}`;

  const result = useSWR<T>(
    `${url}?limit=${limit ? limit : 10}&sort=${
      sort ? sort : 'desc'
    }&type=${type}`,
    fetcher,
    {
      onError(err, key, config) {
        notifications.show({
          color: 'red',
          title: 'Erro inesperado',
          message: 'Houve um erro ao carregar as transações',
        });
      },
    }
  );

  return result;
}
