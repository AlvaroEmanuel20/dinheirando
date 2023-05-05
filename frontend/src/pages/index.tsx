import { Button } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);

  const signOutAndRedirect = async () => {
    const result = await signOut({
      callbackUrl: '/login',
      redirect: false,
    });

    router.push(result.url);
  };

  if (session?.user) {
    return (
      <>
        Você está logado em {session.user.email} <br />
        <Button onClick={signOutAndRedirect}>Sign out</Button>
        <Button>Get user</Button>
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

  return {
    props: {},
  };
};
