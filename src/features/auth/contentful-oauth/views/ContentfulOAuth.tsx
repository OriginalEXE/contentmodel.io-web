import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import Header from '@/src/features/header/components/Header/Header';
import updateUser from '@/src/features/user/api/updateUser';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import optimizeLineBreak from '@/src/typography/optimize-line-break';
import { useStore } from '@/store/hooks';

const ContentfulOAuthView: React.FC = observer(() => {
  const store = useStore();
  const router = useRouter();
  const [viewState, setViewState] = useState<
    'error' | 'processing' | 'success'
  >('processing');
  const updateUserMutation = useMutation(updateUser, {
    onError: () => {
      setViewState('error');
    },
    onSuccess: () => {
      setViewState('success');
      setTimeout(() => {
        router.push('/content-models/new?importType=oauth');
      }, 5000);
    },
  });

  useEffect(() => {
    const parsedHash = queryString.parse(location.hash);

    if (typeof parsedHash['access_token'] !== 'string') {
      setViewState('error');
      return;
    }

    const accessToken = parsedHash['access_token'].trim();

    if (store.me?.id === undefined) {
      setViewState('error');
      return;
    }

    updateUserMutation.mutate({
      id: store.me.id,
      contentful_token_read: accessToken,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.me]);

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-4 xl:flex xl:mt-12 xl:mb-8">
        <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0">
          <h1 className="text-2xl font-bold text-center">
            {optimizeLineBreak('Authenticating with Contentful')}
          </h1>

          <div className="text-center mt-4">
            {viewState === 'processing' ? (
              <p className="text-lg">Connecting the wires, please wait...</p>
            ) : null}

            {viewState === 'error' ? (
              <>
                {' '}
                <p className="text-base">
                  Something went wrong. Try again later, or reach out to us at
                  hello@contentmodel.io
                </p>
                <Link href="/content-models/new">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    className={getButtonClassName({
                      className: 'mt-4',
                    })}
                  >
                    Try again
                  </a>
                </Link>
              </>
            ) : null}

            {viewState === 'success' ? (
              <p className="text-lg">
                Success, your contentmodel.io account now has read access to
                your Contentful account. Redirecting you back...
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
});

ContentfulOAuthView.displayName = 'ContentfulOAuthView';

export default ContentfulOAuthView;
