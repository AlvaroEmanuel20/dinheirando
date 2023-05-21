import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import useSWR from 'swr';

interface UseTransfers {
  id?: string;
  limit?: number;
  sort?: string | null;
}

export default function useTransfers<T>({ id, limit, sort }: UseTransfers) {
  let url = '/transfers';
  if (id) url = `${url}/${id}`;

  const result = useSWR<T>(
    `${url}?limit=${limit ? limit : 10}&sort=${sort}`,
    fetcher,
    {
      onError(err, key, config) {
        notifications.show({
          color: 'red',
          title: 'Erro inesperado',
          message: 'Houve um erro ao carregar as transferências',
        });
      },
    }
  );

  return result;
}
