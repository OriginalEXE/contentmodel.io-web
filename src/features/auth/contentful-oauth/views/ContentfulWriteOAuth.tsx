import { useSessionStorageState } from 'ahooks';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { CONTENTFUL_WRITE_OAUTH_TOKEN_KEY } from '@/src/features/auth/contentful-oauth/constants';
import { CONTENT_MODEL_LAST_IMPORT_SLUG_KEY } from '@/src/features/content-model/import/constants';
import Footer from '@/src/features/footer/Footer';
import Header from '@/src/features/header/components/Header/Header';
import optimizeLineBreak from '@/src/typography/optimize-line-break';

const ContentfulWriteOAuthView: React.FC = () => {
  const router = useRouter();
  const [viewState, setViewState] = useState<
    'error' | 'processing' | 'success'
  >('processing');

  const [, setManagementToken] = useSessionStorageState<string | undefined>(
    CONTENTFUL_WRITE_OAUTH_TOKEN_KEY,
    undefined,
  );

  useEffect(() => {
    const parsedHash = queryString.parse(location.hash);

    if (typeof parsedHash['access_token'] !== 'string') {
      setViewState('error');
      return;
    }

    const accessToken = parsedHash['access_token'].trim();

    setManagementToken(accessToken);

    const contentModelId = sessionStorage.getItem(
      CONTENT_MODEL_LAST_IMPORT_SLUG_KEY,
    ) as string | null;

    if (!contentModelId) {
      setViewState('error');
      return;
    }

    setViewState('success');
    setTimeout(() => {
      router.push(`/content-models/${contentModelId}?importType=oauth`);
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-8 xl:flex xl:mt-12">
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
              </>
            ) : null}

            {viewState === 'success' ? (
              <p className="text-lg">
                Success, your ContentModel.io account now has a temporary write
                access to your Contentful account (for this session only).
                Redirecting you back...
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

ContentfulWriteOAuthView.displayName = 'ContentfulWriteOAuthView';

export default ContentfulWriteOAuthView;
