import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import getContentModelBySlug from '@/src/features/content-model/api/getContentModelBySlug';
import EmbedView from '@/src/features/content-model/embed/views/Embed';
import contentModelSchema from '@/src/features/content-model/types/contentModel';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';
import getCurrentUser from '@/src/features/user/api/getCurrentUser';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';

export const getServerSideProps: GetServerSideProps<{
  storeSnapshot: StoreSnapshotInterface;
  contentModel: ParsedDbContentModel;
}> = async (ctx) => {
  const store = initializeStore();
  const slug = ctx.query.slug as string;
  const secret = (ctx.query.secret as string) || '';

  const [currentUserError, currentUser] = await catchify(
    getCurrentUser(ctx.req.headers.cookie),
  );

  if (currentUserError === null) {
    store.setMe(currentUser.me);
  }

  const [contentModelBySlugError, contentModelBySlug] = await catchify(
    getContentModelBySlug({ slug, secret }, ctx.req.headers.cookie),
  );

  if (
    contentModelBySlugError !== null ||
    contentModelBySlug.contentModelBySlug === null
  ) {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: {
        storeSnapshot: getSnapshot(store),
        contentModel: {
          ...contentModelBySlug.contentModelBySlug,
          model: contentModelSchema.parse(
            JSON.parse(contentModelBySlug.contentModelBySlug.model),
          ),
          position: contentModelPositionSchema.parse(
            JSON.parse(contentModelBySlug.contentModelBySlug.position),
          ),
        },
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

const ContentModelEditPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot, contentModel }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <StoreProvider store={store}>
      <Head>
        <title key="title">
          {contentModel.title} by {contentModel.user.name} - ContentModel.io
        </title>
      </Head>
      <EmbedView contentModel={contentModel} />
    </StoreProvider>
  );
};

export default ContentModelEditPage;
