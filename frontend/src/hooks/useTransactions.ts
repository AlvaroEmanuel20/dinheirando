import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import { formatISO } from 'date-fns';
import useSWR from 'swr';

interface UseTransactions {
  id?: string;
  limit?: number;
  sort?: string | null;
  type?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
}

export default function useTransactions<T>({
  id,
  limit,
  sort,
  type,
  fromDate,
  toDate,
}: UseTransactions) {
  let url = '/transactions';
  if (id) url = `${url}/${id}`;

  let fromDateISO = '';
  let toDateISO = '';
  if (fromDate && toDate) {
    fromDateISO = formatISO(fromDate, { representation: 'date' });
    toDateISO = formatISO(toDate, { representation: 'date' });
  }

  const result = useSWR<T>(
    `${url}?limit=${limit ? limit : 10}&sort=${
      sort ? sort : 'desc'
    }&type=${type}&fromDate=${fromDateISO}&toDate=${toDateISO}`,
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
