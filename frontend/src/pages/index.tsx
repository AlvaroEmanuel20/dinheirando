import { Box, Container, Group, useMantineColorScheme } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import AppHeader from '@/components/home/AppHeader';
import { useStylesHome } from '@/hooks/styles/useStylesHome';
import TotalsSection from '@/components/home/TotalsSection';
import WalletSection from '@/components/home/WalletSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import TransactionsTransfersSection from '@/components/home/TransactionsTransfersSection';

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const { data: session } = useSession();
  const { classes } = useStylesHome();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') signIn();
  }, [session]);

  return (
    <Box mih="100vh" bg={colorScheme === 'dark' ? 'dark.7' : 'violet.6'}>
      <Group
        className={classes.mainGroup}
        noWrap
        position="apart"
        grow
        align="strecth"
        spacing={50}
      >
        <Container className={classes.leftContainer} my={50} p={0} pl={50}>
          <AppHeader />
          <TotalsSection />
          <WalletSection />
          <CategoriesSection />
        </Container>

        <Container
          className={classes.rightContainer}
          fluid
          my={30}
          bg={colorScheme === 'dark' ? 'dark.6' : 'gray.1'}
          p={30}
          sx={{
            borderRadius: '10px 0px 0px 10px',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          <TransactionsTransfersSection />
        </Container>
      </Group>
    </Box>
  );
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
