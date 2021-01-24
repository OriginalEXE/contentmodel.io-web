import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import NewView from '@/src/features/content-model/new/views/New';
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
  }

  // One needs to authenticate in order to create a new content model
  if (store.me === null) {
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

const NewPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <StoreProvider store={store}>
      <Head>
        <title>Share content model - contentmodel.io</title>
      </Head>
      <NewView />
    </StoreProvider>
  );
};

export default NewPage;
