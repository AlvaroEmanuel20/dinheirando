import { fetcher } from '@/lib/apiInstance';
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
    fetcher
  );

  return result;
}
