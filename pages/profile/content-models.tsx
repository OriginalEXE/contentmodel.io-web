import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { SSRProvider } from 'react-aria';

import getContentModels from '@/src/content-model/api/getContentModels';
import contentModelSchema from '@/src/content-model/types/contentModel';
import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import ProfileDirectoryView from '@/src/content-model/view/views/ProfileDirectory';
import contentModelPositionSchema from '@/src/diagram/types/contentModelPosition';
import getCurrentUser from '@/src/user/api/getCurrentUser';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';

export const getServerSideProps: GetServerSideProps<{
  storeSnapshot: StoreSnapshotInterface;
  contentModels: ParsedDbContentModel[];
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
        destination: '/api/login?redirectTo=/profile/content-models',
        permanent: false,
      },
    };
  }

  const [contentModelsError, contentModels] = await catchify(
    getContentModels({ user: currentUser.me.id }, ctx.req.headers.cookie),
  );

  let parsedContentModels: (ParsedDbContentModel | null)[] = [];

  if (contentModelsError === null) {
    parsedContentModels = contentModels.contentModels.items.map(
      (contentModel) => {
        try {
          return {
            ...contentModel,
            model: contentModelSchema.parse(JSON.parse(contentModel.model)),
            position: contentModelPositionSchema.parse(
              JSON.parse(contentModel.position),
            ),
          };
        } catch {
          return null;
        }
      },
    );
  }

  return {
    props: {
      storeSnapshot: getSnapshot(store),
      contentModels: parsedContentModels.filter(
        (contentModel) => contentModel !== null,
      ) as ParsedDbContentModel[],
    },
  };
};

const ProfileContentModelsPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot, contentModels }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <SSRProvider>
      <StoreProvider store={store}>
        <Head>
          <title>My content models - contentmodel.io</title>
        </Head>
        <ProfileDirectoryView contentModels={contentModels} />
      </StoreProvider>
    </SSRProvider>
  );
};

export default ProfileContentModelsPage;
