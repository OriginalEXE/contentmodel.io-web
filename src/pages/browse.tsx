import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import getContentModels from '@/src/features/content-model/api/getContentModels';
import BrowseView from '@/src/features/content-model/browse/views/Browse';
import contentModelSchema from '@/src/features/content-model/types/contentModel';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';
import getCurrentUser from '@/src/features/user/api/getCurrentUser';
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
  }

  const [contentModelsError, contentModels] = await catchify(
    getContentModels({ visibility: 'PUBLIC', count: 150 }, ctx.req.headers.cookie),
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

const BrowsePage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot, contentModels }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <StoreProvider store={store}>
      <Head>
        <title>My content models - ContentModel.io</title>
      </Head>
      <BrowseView contentModels={contentModels} />
    </StoreProvider>
  );
};

export default BrowsePage;
