import type { AppProps } from 'next/app';
import { ThemeProvider } from '@emotion/react';
import Global from 'styles/global';
import { commonTheme } from 'styles/theme';
import dynamic from 'next/dynamic';
import ContextProvider from 'ctx/ImageProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={commonTheme}>
      <ContextProvider>
        <>
          <Global />
          <Component {...pageProps} />
        </>
      </ContextProvider>
    </ThemeProvider>
  );
}
