import type { AppProps } from 'next/app';
import Head from 'next/head';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { RouterTransition } from '@/components/shared/RouterTransition';
import { SessionProvider } from 'next-auth/react';
import { DatesProvider } from '@mantine/dates';
import 'dayjs/locale/pt-br';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Head>
        <title>Dinheirando</title>
        <meta name="description" content="Aplicativo de controle financeiro" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
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
          <Notifications limit={5} />
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
