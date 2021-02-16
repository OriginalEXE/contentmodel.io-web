import Image from 'next/image';
import Link from 'next/link';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import MarkdownToText from '@/src/shared/components/MarkdownToText/MarkdownToText';

interface ContentModelsListProps {
  contentModels: ParsedDbContentModel[];
  className?: string;
}

const ContentModelsList: React.FC<ContentModelsListProps> = (props) => {
  const { contentModels, className = '' } = props;

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {contentModels.map((contentModel) => (
        <Link
          href={`/content-models/${contentModel.slug}`}
          key={contentModel.id}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="block min-w-0 rounded-lg transform transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-seagreen-600 lg:mb-0">
            <article className="bg-sepia-100 border-b-4 border-sepia-400 p-4 rounded-lg">
              {contentModel.image !== null ? (
                <div className="relative w-full h-52 mb-4">
                  <Image
                    src={contentModel.image.path}
                    alt={`Diagram of ${contentModel.title}`}
                    quality={92}
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 50vw, 90vw"
                    objectFit="contain"
                    layout="fill"
                  />
                </div>
              ) : null}

              <h2 className="text-xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden">
                {contentModel.title}
              </h2>
              {contentModel.description && (
                <p className="mt-2 text-base whitespace-nowrap overflow-ellipsis overflow-hidden">
                  <MarkdownToText>{contentModel.description}</MarkdownToText>
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
