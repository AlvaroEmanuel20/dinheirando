import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import { formatISO } from 'date-fns';
import useSWR from 'swr';

interface UseTransfers {
  id?: string;
  limit?: number;
  sort?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
}

export default function useTransfers<T>({
  id,
  limit,
  sort,
  fromDate,
  toDate,
}: UseTransfers) {
  let url = '/transfers';
  if (id) url = `${url}/${id}`;

  let fromDateISO = '';
  let toDateISO = '';
  if (fromDate && toDate) {
    fromDateISO = formatISO(new Date(fromDate), { representation: 'date' });
    toDateISO = formatISO(new Date(toDate), { representation: 'date' });
  }

  const result = useSWR<T>(
    `${url}?limit=${limit ? limit : 10}&sort=${
      sort ? sort : 'desc'
    }&fromDate=${fromDateISO}&toDate=${toDateISO}`,
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
