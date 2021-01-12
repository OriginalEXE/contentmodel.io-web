import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { SSRProvider } from 'react-aria';

import getContentModelBySlug from '@/src/content-model/api/getContentModelBySlug';
import EditView from '@/src/content-model/edit/views/Edit';
import contentModelSchema from '@/src/content-model/types/contentModel';
import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import contentModelPositionSchema from '@/src/diagram/types/contentModelPosition';
import getCurrentUser from '@/src/user/api/getCurrentUser';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';

export const getServerSideProps: GetServerSideProps<{
  storeSnapshot: StoreSnapshotInterface;
  contentModel: ParsedDbContentModel;
}> = async (ctx) => {
  const store = initializeStore();
  const slug = ctx.query.slug as string;

  const [currentUserError, currentUser] = await catchify(
    getCurrentUser(ctx.req.headers.cookie),
  );

  if (currentUserError === null) {
    store.setMe(currentUser.me);
  } else {
    return {
      redirect: {
        destination: `/api/login?redirectTo=/content-models/${slug}/edit`,
        permanent: false,
      },
    };
  }

  const [contentModelBySlugError, contentModelBySlug] = await catchify(
    getContentModelBySlug({ slug }, ctx.req.headers.cookie),
  );

  if (
    contentModelBySlugError !== null ||
    contentModelBySlug.contentModelBySlug === null
  ) {
    return {
      notFound: true,
    };
  }

  if (contentModelBySlug.contentModelBySlug.user.id !== currentUser.me.id) {
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
    <SSRProvider>
      <StoreProvider store={store}>
        <Head>
          <title>Edit {contentModel.title} - contentmodel.io</title>
        </Head>
        <EditView contentModel={contentModel} />
      </StoreProvider>
    </SSRProvider>
  );
};

export default ContentModelEditPage;
