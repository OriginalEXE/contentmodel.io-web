import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import ContentModelsList from '@/src/features/content-model/components/ContentModelsList/ContentModelsList';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import Header from '@/src/features/header/components/Header/Header';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ProfileDirectoryViewProps {
  contentModels: ParsedDbContentModel[];
}

const ProfileDirectoryView: React.FC<ProfileDirectoryViewProps> = observer(
  (props) => {
    const { contentModels } = props;

    return (
      <>
        <Header />
        <main className="w-full max-w-screen-2xl mx-auto px-3 mb-8 xl:flex xl:mt-12">
          <div className="w-full max-w-5xl mt-8 mx-auto flex-shrink-0">
            <div className="w-16 h-16 flex items-center justify-center rounded-full text-3xl bg-red-200 transform -rotate-6">
              <FontAwesomeIcon icon={['fal', 'user']} />
            </div>
            <h1 className="mt-4 text-2xl font-bold max-w-sm lg:text-3xl xl:text-4xl">
              Content models shared by you
            </h1>
            {contentModels.length > 0 ? (
              <>
                <ContentModelsList
                  contentModels={contentModels}
                  className="mt-6 md:mt-12"
                />
                <p className="text-base mt-8">
                  We are working on adding better discovery tools (search,
                  filtering etc.)
                </p>
              </>
            ) : (
              <div className="mt-6">
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
