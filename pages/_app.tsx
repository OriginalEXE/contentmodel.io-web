import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { SSRProvider } from 'react-aria';
import { QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

import '@/src/shared/icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@jsplumb/browser-ui/css/jsplumbtoolkit.css';
import '@/css/style.css';
import getQueryClient from '@/src/graphql/getQueryClient';
import useScript from '@/src/use-script/useScript';

const queryClient = getQueryClient();

const App: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  useScript('https://plausible.io/js/plausible.js', {
    'data-domain': typeof window === 'undefined' ? '' : window.location.host,
  });

  return (
    <SSRProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>contentmodel.io</title>
            <meta
              key="description"
              name="description"
              content="Share your content model, or get inspired"
            />
          </Head>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </SSRProvider>
  );
};

export default App;
