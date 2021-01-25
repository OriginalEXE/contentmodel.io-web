import { useMemo } from 'react';
import * as z from 'zod';

import contentTypeSchema from '@/src/features/content-model/types/contentType';
import contentTypeFieldSchema from '@/src/features/content-model/types/contentTypeField';
import { CONTENT_TYPE_JS_CLASS } from '@/src/features/diagram/constants';
import {
  generateContentTypeDOMId,
  generateContentTypeFieldDOMId,
} from '@/src/features/diagram/utilities/generateDOMId';

export interface ContentTypeProps {
  contentType: z.infer<typeof contentTypeSchema>;
  selected?: boolean;
  className?: string;
}

const ContentType: React.FC<ContentTypeProps> = (props) => {
  const { contentType, selected = false, className = '' } = props;

  const contentTypeName = useMemo(() => {
    if (contentType.internal === true) {
      return `${contentType.name} (internal)`;
    }

    return contentType.name;
  }, [contentType]);

  const getContentTypeFieldType = (
    field: z.infer<typeof contentTypeFieldSchema>,
  ): string => {
    if (field.type === 'Link' && field.linkType === 'Asset') {
      return 'Asset';
    }

    if (field.type === 'Link') {
      return 'Reference (1)';
    }

    if (field.type === 'Array' && field.items !== undefined) {
      if (field.items.linkType === 'Asset') {
        return 'Assets';
      }

      return 'Reference (n)';
    }

    if (field.type === 'Symbol') {
      return 'Text';
    }

    if (field.type === 'Text') {
      return 'Long Text';
    }

    return field.type;
  };

  return (
    <article
      id={generateContentTypeDOMId(contentType.sys.id)}
      className={`w-84 rounded-lg border-4 overflow-hidden bg-white ${
        selected
          ? 'shadow border-primary-200 z-10'
          : 'shadow-sm border-white z-20'
      } ${CONTENT_TYPE_JS_CLASS} ${className}`}
      data-content-type={contentType.sys.id}
    >
      <header className="py-1">
        <h2 className="text-center p-2 font-semibold text-lg">
          {contentTypeName}
        </h2>
      </header>
      <div className="h-2 w-16 rounded mx-auto bg-primary-300" />
      <div className="mt-3">
        {contentType.fields.map((contentTypeField) => (
          <div
            key={contentTypeField.id}
            id={generateContentTypeFieldDOMId(
              contentType.sys.id,
              contentTypeField.id,
            )}
            className="px-3 pt-1 pb-2 flex"
          >
            <h3 className="font-semibold text-base flex-grow break-words text-gray-700">
              {contentTypeField.name}
            </h3>
            <p className="text-base text-gray-600 flex-grow-0 flex-shrink-0">
              {getContentTypeFieldType(contentTypeField)}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ContentType;
