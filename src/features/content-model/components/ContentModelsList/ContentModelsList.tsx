import Link from 'next/link';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import StyledDynamicContent from '@/src/shared/components/StyledDynamicContent/StyledDynamicContent';

interface ContentModelsListProps {
  contentModels: ParsedDbContentModel[];
  className?: string;
}

const ContentModelsList: React.FC<ContentModelsListProps> = (props) => {
  const { contentModels, className = '' } = props;

  return (
    <div className={className}>
      {contentModels.map((contentModel) => (
        <Link
          href={`/content-models/${contentModel.slug}`}
          key={contentModel.id}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="block rounded-lg focus:outline-none focus:ring-2 mb-4">
            <article className="bg-white p-4 shadow-sm rounded-lg">
              <h2 className="text-xl font-semibold">{contentModel.title}</h2>
              {contentModel.description && (
                <StyledDynamicContent className="mt-2">
                  {contentModel.description}
                </StyledDynamicContent>
              )}

              <div className="flex flex-wrap items-center mt-3">
                <p className="text-base font-semibold mr-4 my-1">Shared by:</p>
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
