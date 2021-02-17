import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { SSRProvider } from 'react-aria';
import { OverlayProvider } from 'react-aria';
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
          <OverlayProvider className="flex flex-col min-h-screen">
            <Head>
              <title key="title">ContentModel.io</title>
              <meta
                property="og:title"
                content="ContentModel.io"
                key="og:title"
              />
              <meta
                key="description"
                name="description"
                content="ContentModel.io is a community-sourced, visual directory of Contentful content models"
              />
              <meta
                property="og:description"
                content="ContentModel.io is a community-sourced, visual directory of Contentful content models"
                key="og:description"
              />
              <meta
                property="og:image"
                content="https://res.cloudinary.com/contentmodelio/image/upload/v1613593969/app/marketing/og-meta-image_qoxffo.png"
                key="og:image"
              />
            </Head>
            <Component {...pageProps} />
          </OverlayProvider>
        </Hydrate>
      </QueryClientProvider>
    </SSRProvider>
  );
};

export default App;
