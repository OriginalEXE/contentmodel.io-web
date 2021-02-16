import catchify from 'catchify';
import { getSnapshot } from 'mobx-state-tree';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef } from 'react';

import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import SubscribeWidget from '@/src/features/teams-launch/components/SubscribeWidget/SubscribeWidget';
import getCurrentUser from '@/src/features/user/api/getCurrentUser';
import scrollToEl from '@/src/scrolling/scrollToEl';
import contentModelsDirectory from '@/src/shared/assets/illustrations/content-models-directory.svg';
import visualizeContentModel from '@/src/shared/assets/illustrations/visualize-content-model.svg';
import contentModelScreenshot from '@/src/shared/assets/screenshots/content-model.png';
import testimonial1 from '@/src/shared/assets/social-proof/twitter-testimonial.png';
import Button from '@/src/shared/components/Button/Button';
import optimizeLineBreak from '@/src/typography/optimize-line-break';
import { initializeStore, StoreSnapshotInterface } from '@/store';
import { StoreProvider } from '@/store/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  return {
    props: {
      storeSnapshot: getSnapshot(store),
    },
  };
};

const TeamsPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ storeSnapshot }) => {
  const store = initializeStore(storeSnapshot);

  const subscriptionSectionElRef = useRef<HTMLElement>(null);

  return (
    <StoreProvider store={store}>
      <Head>
        <title key="title">ContentModel.io for teams</title>
        <meta
          property="og:title"
          content="ContentModel.io for teams"
          key="og:title"
        />
        <meta
          key="description"
          name="description"
          content="Visualize your content model. Understand it. Then simplify it."
        />
        <meta
          property="og:description"
          content="Visualize your content model. Understand it. Then simplify it."
          key="og:description"
        />
      </Head>
      <Header />
      <main className="w-full mb-8">
        <section className="w-full max-w-screen-2xl mx-auto py-12 px-3 text-center md:py-16 lg:py-24">
          <div className="container mx-auto px-4 max-w-2xl lg:max-w-3xl lg:grid lg:gap-2">
            <div>
              <h1 className="font-bold text-3xl text-gray-900 sm:text-4xl lg:leading-tight xl:text-6xl">
                {optimizeLineBreak(
                  'Visualize your content model. Understand it. Then simplify it.',
                )}
              </h1>
              <p className="mt-5 mx-auto text-base max-w-xl text-gray-800 lg:text-2xl lg:mt-8">
                We turn even your most complex content models into easily
                digestible diagrams
              </p>
              <div
                className="max-w-4xl mx-auto mt-6 md:mt-12 p-2 bg-yellow-100 rounded-lg"
                style={{
                  fontSize: 0,
                }}
              >
                <Image
                  src={contentModelScreenshot}
                  alt="Content model screenshot"
                  width={1568}
                  height={857}
                  quality={85}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 px-3 md:py-16">
          <h2 className="mt-4 text-2xl font-bold text-center lg:text-3xl xl:text-4xl">
            What others are saying
          </h2>
          <div className="max-w-lg mx-auto mt-4 md:mt-8 rounded-lg border border-seagreen-300 overflow-hidden">
            <Image
              src={testimonial1}
              alt="Twitter testimonial"
              width={1062}
              height={521}
              quality={85}
              priority
            />
          </div>
          <div className="text-center">
            <Button
              className="mt-5 lg:mt-12"
              size="lg"
              color="primary"
              onClick={() => {
                if (subscriptionSectionElRef.current === null) {
                  return;
                }

                scrollToEl({ el: subscriptionSectionElRef.current });
              }}
            >
              Get notified on launch
            </Button>
          </div>
        </section>

        <section className="w-full py-12 px-3 md:py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center">
            <div className="w-full order-2 md:order-1 md:w-1/2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-primary-200 transform -rotate-6">
                <FontAwesomeIcon icon={['fal', 'project-diagram']} />
              </div>
              <h2 className="mt-4 text-2xl font-bold max-w-md lg:text-3xl xl:text-4xl">
                {optimizeLineBreak(
                  'Understand and optimize your content model',
                )}
              </h2>
              <div className="mt-6 md:mt-12">
                <p className="text-base max-w-2xl lg:text-xl">
                  Contentful interface is great for when you want to make
                  specific changes to your content model. It falls short when
                  you are trying to understand what to change in the first
                  place. ContentModel.io diagram will show you your whole
                  content model at once and even highlight which content types
                  reference each other.
                </p>
              </div>
            </div>
            <div className="w-full flex justify-center order-1 mb-5 md:mb-0 md:w-1/2 md:order-2">
              <img
                src={visualizeContentModel}
                alt="Content model visualization mockup"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 px-3 md:py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center">
            <div className="w-full order-2 md:order-1 md:w-1/2">
              <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-seagreen-200 transform -rotate-6">
                <FontAwesomeIcon icon={['fal', 'lock']} />
              </div>
              <h2 className="mt-4 text-2xl font-bold max-w-sm lg:text-3xl xl:text-4xl">
                Private library of your content models
              </h2>
              <div className="mt-6 md:mt-12">
                <p className="text-base max-w-2xl lg:text-2xl">
                  Your content models live in your Contentful spaces, but
                  that&apos;s not always the best place for them. With
                  ContentModel.io, all of your content models are accessible in
                  a single place. And with our granular permissions, you can
                  give teams access irrelevant of their Contentful permissions.
                </p>
              </div>
            </div>
            <div className="w-full flex justify-center order-1 mb-5 md:mb-0 md:w-1/2 md:order-2">
              <img
                src={contentModelsDirectory}
                alt="Content models directory mockup"
              />
            </div>
          </div>
        </section>

        <section className="w-full pt-12 pb-6 px-3 md:pt-16 md:pb-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center">
            <div className="w-full">
              <h2 className="mt-4 text-2xl font-bold text-center lg:text-3xl xl:text-4xl">
                and many other exciting features...
              </h2>
            </div>
          </div>
        </section>

        <section
          className="w-full py-12 px-3 md:py-16"
          ref={subscriptionSectionElRef}
        >
          <div className="max-w-2xl mx-auto bg-yellow-100">
            <SubscribeWidget />
          </div>
        </section>
      </main>
      <Footer />
    </StoreProvider>
  );
};

export default TeamsPage;
