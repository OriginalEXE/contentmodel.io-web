import { observer } from 'mobx-react-lite';
import Link from 'next/link';

import ContentModelsList from '@/src/features/content-model/components/ContentModelsList/ContentModelsList';
import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import Header from '@/src/features/header/components/Header/Header';
import { getButtonClassName } from '@/src/shared/components/Button/getButtonClassName';
import optimizeLineBreak from '@/src/typography/optimize-line-break';

interface DirectoryViewProps {
  contentModels: ParsedDbContentModel[];
}

const DirectoryView: React.FC<DirectoryViewProps> = observer((props) => {
  const { contentModels } = props;

  return (
    <>
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-3 mb-4 xl:flex xl:mt-12 xl:mb-8">
        <div className="w-full max-w-xl mt-8 mx-auto flex-shrink-0">
          <h1 className="text-2xl font-bold text-center">
            {optimizeLineBreak('Browse shared content models')}
          </h1>
          {contentModels.length > 0 ? (
            <ContentModelsList
              contentModels={contentModels}
              className="mt-6 md:mt-12"
            />
          ) : (
            <div className="text-center mt-4">
              <p className="text-lg">
                It looks like noone has shared their content model yet. Why not
                be the first?
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
});

DirectoryView.displayName = 'DirectoryView';

export default DirectoryView;
