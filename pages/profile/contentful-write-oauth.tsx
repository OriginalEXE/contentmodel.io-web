import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import React from 'react';

import ContentfulWriteOAuthView from '@/src/features/auth/contentful-oauth/views/ContentfulWriteOAuth';
import getCurrentUser from '@/src/features/user/api/getCurrentUser';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';

export const getServerSideProps: GetServerSideProps<{
  storeSnapshot: StoreSnapshotInterface;
}> = async (ctx) => {
  const store = initializeStore();

  const [currentUserError, currentUser] = await catchify(
    getCurrentUser(ctx.req.headers.cookie),
  );

  if (currentUserError === null) {
    store.setMe(currentUser.me);
  } else {
    return {
      redirect: {
        destination: '/api/login?redirectTo=/content-models/new',
        permanent: false,
      },
    };
  }

  return {
    props: {
      storeSnapshot: getSnapshot(store),
    },
  };
};

const ProfileContentfulWriteOAuthPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <StoreProvider store={store}>
      <Head>
        <title>Contentful OAuth - contentmodel.io</title>
      </Head>
      <ContentfulWriteOAuthView />
    </StoreProvider>
  );
};

export default ProfileContentfulWriteOAuthPage;
