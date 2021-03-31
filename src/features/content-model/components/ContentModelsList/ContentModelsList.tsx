import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ParsedDbContentModel } from '@/src/features/content-model/types/parsedDbContentModel';
import ProfileBadge from '@/src/features/user/components/ProfileBadge/ProfileBadge';
import MarkdownToText from '@/src/shared/components/MarkdownToText/MarkdownToText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ContentModelsListProps {
  contentModels: ParsedDbContentModel[];
  className?: string;
}

const ContentModelsList: React.FC<ContentModelsListProps> = (props) => {
  const { contentModels, className = '' } = props;

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {contentModels.map((contentModel) => (
        <Link
          href={`/content-models/${contentModel.slug}`}
          key={contentModel.id}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="block min-w-0 rounded-lg focus:outline-none lg:mb-0 group">
            <article>
              {contentModel.image !== null ? (
                <div className="bg-sepia-100 p-4 border border-sepia-300 rounded-lg mb-4">
                  <div className="relative w-full h-52">
                    <Image
                      src={contentModel.image.path}
                      alt={`Diagram of ${contentModel.title}`}
                      quality={92}
                      sizes="(min-width: 1024px) 300px, (min-width: 768px) 50vw, 90vw"
                      objectFit="contain"
                      layout="fill"
                    />
                  </div>
                </div>
              ) : null}

              <h2 className="text-xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden group-hover:underline group-focus:underline">
                {contentModel.title}
              </h2>
              {contentModel.description && (
                <p className="mt-2 text-base whitespace-nowrap overflow-ellipsis overflow-hidden">
                  <MarkdownToText>{contentModel.description}</MarkdownToText>
                </p>
              )}

              <div className="flex items-center mt-3">
                <ProfileBadge user={contentModel.user} className="my-1" />
                <div className="ml-auto flex items-center">
                  <FontAwesomeIcon
                    icon={[contentModel.starred ? 'fas' : 'fal', 'star']}
                    className="mr-1"
                  />

                  {contentModel.stars}
                </div>
              </div>
            </article>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default ContentModelsList;
