import { Button } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiInstance } from '@/lib/apiInstance';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const signOutAndRedirect = async () => {
    const result = await signOut({
      callbackUrl: '/login',
      redirect: false,
    });

    router.push(result.url);
  };

  const getUser = async () => {
    try {
      const res = await apiInstance.get('/users');
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') signIn();
  }, [session]);

  if (session?.user) {
    return (
      <>
        Você está logado em {session.user.email} <br />
        <Button onClick={signOutAndRedirect}>Sign out</Button>
        <Button onClick={getUser}>Get user</Button>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (session.error === 'RefreshAccessTokenError') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
