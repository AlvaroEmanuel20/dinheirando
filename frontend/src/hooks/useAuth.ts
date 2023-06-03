import { apiInstance } from '@/lib/apiInstance';
import { AxiosError } from 'axios';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface AuthError {
  message: string;
  statusCode: number;
}

interface SignInValues {
  email: string;
  password: string;
}

interface SignUpValues extends SignInValues {
  name: string;
}

export default function useAuth() {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [errorSignOut, setErrorSignOut] = useState<AuthError | null>(null);
  const [isLoadingSignOut, setIsLoadingSignOut] = useState(false);

  const [errorSignIn, setErrorSignIn] = useState<AuthError | null>(null);
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false);

  const [errorSignUp, setErrorSignUp] = useState<AuthError | null>(null);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);

  const signUpAndRedirect = async (values: SignUpValues) => {
    setIsLoadingSignUp(true);

    try {
      await apiInstance.post('/users', values);
      setIsLoadingSignUp(false);
      router.push('/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setErrorSignUp({ message: 'Email já cadastrado', statusCode: 409 });
        } else {
          setErrorSignUp({
            message: 'Erro interno no servidor',
            statusCode: 500,
          });
        }
      }

      setIsLoadingSignUp(false);
    }
  };

  const signInAndRedirect = async (values: SignInValues) => {
    setIsLoadingSignIn(true);
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    });

    if (result?.error) {
      if (result.status === 401) {
        setErrorSignIn({
          message: 'Email ou senha incorretos',
          statusCode: 401,
        });
      } else {
        setErrorSignIn({
          message: 'Erro interno no servidor',
          statusCode: 500,
        });
      }
    }

    setIsLoadingSignIn(false);
    if (result?.url) router.push(result.url);
  };

  const signOutAndRedirect = async () => {
    setIsLoadingSignOut(true);
    const result = await signOut({
      callbackUrl: '/login',
      redirect: false,
    });

    if (!result.url) {
      setErrorSignOut({ message: 'Erro interno no servidor', statusCode: 500 });
    } else {
      setIsLoadingSignOut(false);
      router.push(result.url);
      //await mutate(() => true, undefined, { revalidate: false });
    }
  };

  return {
    signOutAndRedirect,
    isLoadingSignOut,
    errorSignOut,
    signInAndRedirect,
    isLoadingSignIn,
    errorSignIn,
    signUpAndRedirect,
    isLoadingSignUp,
    errorSignUp,
  };
}
