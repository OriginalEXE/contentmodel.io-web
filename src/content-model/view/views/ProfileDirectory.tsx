import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import ContentModelsList from '@/src/content-model/components/ContentModelsList/ContentModelsList';
import { ParsedDbContentModel } from '@/src/content-model/types/parsedDbContentModel';
import Header from '@/src/header/components/Header/Header';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import optimizeLineBreak from '@/src/typography/optimize-line-break';

interface ProfileDirectoryViewProps {
  contentModels: ParsedDbContentModel[];
}

const ProfileDirectoryView: React.FC<ProfileDirectoryViewProps> = observer(
  (props) => {
    const { contentModels } = props;

    return (
      <>
        <Header />
        <main className="w-full max-w-screen-2xl mx-auto px-3 mb-4 xl:flex xl:mt-12 xl:mb-8">
          <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0">
            <h1 className="text-2xl font-bold text-center">
              {optimizeLineBreak('Content models shared by you')}
            </h1>
            {contentModels.length > 0 ? (
              <ContentModelsList
                contentModels={contentModels}
                className="mt-6 md:mt-12"
              />
            ) : (
              <div className="text-center mt-4">
                <p className="text-lg">
                  It looks like you have not shared any content models yet.
                  Today is a good day to change that!
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
        </main>
      </>
    );
  },
);

ProfileDirectoryView.displayName = 'ProfileDirectoryView';

export default ProfileDirectoryView;
