import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import getContentModels from '@/src/features/content-model/api/getContentModels';
import ContentModelsList from '@/src/features/content-model/components/ContentModelsList/ContentModelsList';
import contentModelSchema from '@/src/features/content-model/types/contentModel';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';
import Header from '@/src/features/header/components/Header/Header';
import getCurrentUser from '@/src/features/user/api/getCurrentUser';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    getContentModels(
      {
        count: 6,
      },
      ctx.req.headers.cookie,
    ),
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

const ContentModelsPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot, contentModels }) => {
  const store = initializeStore(storeSnapshot);

  return (
    <StoreProvider store={store}>
      <Header />
      <main className="w-full mb-8">
        <section className="w-full max-w-screen-2xl mx-auto py-16 px-3 text-center lg:py-24">
          <div className="container mx-auto px-4 max-w-2xl lg:max-w-3xl lg:grid lg:gap-2">
            <div>
              <h1 className="font-semibold text-4xl leading-tight text-gray-900 lg:text-5xl xl:text-6xl xl:font-bold">
                Content modelling, visualized
              </h1>
              <p className="mt-5 mx-auto text-base max-w-xl text-gray-800 lg:text-2xl lg:mt-8">
                contentmodel.io is a community-sourced, visual directory of
                Contentful content models
              </p>
              <Link href="/browse">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={getButtonClassName({
                    color: 'primary',
                    size: 'lg',
                    className: 'mt-5 lg:mt-12',
                  })}
                >
                  <FontAwesomeIcon icon={['fal', 'books']} className="mr-2" />{' '}
                  Browse the library
                </a>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-3">
          <div className="max-w-5xl mx-auto relative">
            <div className="relative z-10">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-yellow-200 transform -rotate-6">
                <FontAwesomeIcon icon={['fal', 'users']} />
              </div>
              <h2 className="mt-4 text-2xl font-bold max-w-sm lg:text-3xl xl:text-4xl">
                Latest content models from our community
              </h2>
              {contentModels.length > 0 ? (
                <>
                  <ContentModelsList
                    contentModels={contentModels}
                    className="mt-6 md:mt-12"
                  />
                  <Link href="/browse">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      className={getButtonClassName({
                        size: 'lg',
                        className: 'mt-4 lg:mt-8',
                        variant: 'text',
                      })}
                    >
                      Browse the full library
                    </a>
                  </Link>
                </>
              ) : (
                <div className="mt-6">
                  <p className="text-lg">
                    It looks like noone has shared their content model yet. Why
                    not be the first?
                  </p>
                  <Link href="/content-models/new">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      className={getButtonClassName({
                        color: 'primary',
                        className: 'mt-4',
                      })}
                    >
                      Share your first content model
                    </a>
                  </Link>
                </div>
              )}
            </div>
            <div className="absolute z-0 w-3/6 h-3/6 bg-yellow-50 rounded-full -bottom-12 -left-10 transform rotate-12" />
          </div>
        </section>

        <section className="w-full py-16 px-3">
          <div className="max-w-5xl mx-auto relative">
            <div className="relative z-10">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-seagreen-200 transform -rotate-6">
                <FontAwesomeIcon icon={['fal', 'shoe-prints']} />
              </div>
              <h2 className="mt-4 text-2xl font-bold max-w-sm lg:text-3xl xl:text-4xl">
                How sharing works
              </h2>
              <div className="mt-6 md:mt-12">
                <p className="text-base max-w-2xl lg:text-2xl">
                  We make it super convenient to share your content model with
                  anyone by simply giving them a URL. You can quickly import
                  your content model from Contentful through the process of safe
                  authentication, or by importing an export file generated by
                  Contentful CLI.
                </p>
              </div>
            </div>
            <div className="absolute z-0 w-2/6 h-3/6 bg-seagreen-50 -bottom-8 right-8 xl:-right-12 transform -rotate-45" />
          </div>
        </section>
      </main>
    </StoreProvider>
  );
};

export default ContentModelsPage;
