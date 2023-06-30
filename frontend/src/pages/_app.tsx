import Head from 'next/head';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { RouterTransition } from '@/components/shared/RouterTransition';
import { SessionProvider } from 'next-auth/react';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import { Notifications } from '@mantine/notifications';
import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');

    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Dinheirando</title>
        <meta name="description" content="Aplicativo de controle financeiro" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dinheirando" />
        <meta
          property="og:description"
          content="Aplicativo de controle financeiro pessoal."
        />
        <meta property="og:site_name" content="Dinheirando" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            globalStyles: (theme) => ({
              body: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.white,
              },
            }),
            breakpoints: {
              xss: '25em',
              xs: '30em',
              lxs: '44em',
              sm: '48em',
              md: '64em',
              lmd: '65em',
              lg: '74em',
              lgg: '80em',
              xl: '90em',
            },
          }}
        >
          <Notifications autoClose={5000} limit={5} />
          <RouterTransition />
          <SessionProvider session={pageProps.session}>
            <DatesProvider settings={{ locale: 'pt-br' }}>
              <Component {...pageProps} />
            </DatesProvider>
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'light',
  };
};

