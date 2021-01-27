import Link from 'next/link';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import MarkupToText from '@/src/shared/components/MarkupToText/MarkupToText';

interface ContentModelsListProps {
  contentModels: ParsedDbContentModel[];
  className?: string;
}

const ContentModelsList: React.FC<ContentModelsListProps> = (props) => {
  const { contentModels, className = '' } = props;

  return (
    <div className={`lg:grid lg:grid-cols-3 lg:gap-4 ${className}`}>
      {contentModels.map((contentModel) => (
        <Link
          href={`/content-models/${contentModel.slug}`}
          key={contentModel.id}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="block rounded-lg mb-4 transform transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 lg:mb-0">
            <article className="bg-sepia-100 border-b-4 border-sepia-400 p-4 rounded-lg">
              <h2 className="text-xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden">
                {contentModel.title}
              </h2>
              {contentModel.description && (
                <p className="mt-2 text-base whitespace-nowrap overflow-ellipsis overflow-hidden">
                  <MarkupToText>{contentModel.description}</MarkupToText>
                </p>
              )}

              <div className="flex items-center mt-3">
                <ProfileBadge user={contentModel.user} className="my-1" />
              </div>
            </article>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default ContentModelsList;
