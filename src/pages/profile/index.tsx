import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import getCurrentUser from '@/src/features/user/api/getCurrentUser';
import ProfileView from '@/src/features/user/profile/views/Profile';
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
        destination: '/api/login?redirectTo=/profile',
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

const ProfilePage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot }) => {
  const store = initializeStore(storeSnapshot);

  return store.me === null ? null : (
    <StoreProvider store={store}>
      <Head>
        <title>My profile - ContentModel.io</title>
      </Head>
      <ProfileView user={store.me} />
    </StoreProvider>
  );
};

export default ProfilePage;
