import { fetcher } from '@/lib/apiInstance';
import { notifications } from '@mantine/notifications';
import { format } from 'our-dates';
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
    fromDateISO = format(new Date(fromDate), 'yyyy-MM-dd');
    toDateISO = format(new Date(toDate), 'yyyy-MM-dd');
  }

  const result = useSWR<T>(
    `${url}?limit=${
      limit ? limit : 10
    }&sort=${sort ? sort : 'desc'}&fromDate=${fromDateISO}&toDate=${toDateISO}`,
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
