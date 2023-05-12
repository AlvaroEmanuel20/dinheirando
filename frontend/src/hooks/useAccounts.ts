import { fetcher } from '@/lib/apiInstance';
import useSWR from 'swr';

export default function useAccounts<T>(id?: string) {
  let url = '/accounts';
  if (id) url = `${url}/${id}`;
  const result = useSWR<T>(url, fetcher);
  return result;
}
