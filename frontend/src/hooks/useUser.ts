import { fetcher } from '@/lib/apiInstance';
import { User } from '@/lib/apiTypes/users';
import useSWR from 'swr';

export default function useUser() {
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: errorUser,
  } = useSWR<User>('/users', fetcher);
  return { userData, isLoadingUser, errorUser };
}
