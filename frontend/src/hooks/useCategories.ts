import { fetcher } from '@/lib/apiInstance';
import useSWR from 'swr';

interface UseCategories {
  id?: string;
  type?: 'income' | 'expense';
  limit?: number;
}

export default function useCategories<T>({ id, type, limit }: UseCategories) {
  let url = '/categories';
  if (id) url = `${url}/${id}`;
  const result = useSWR<T>(`${url}?limit=${limit ? limit : 10}&type=${type}`, fetcher);
  return result;
}
