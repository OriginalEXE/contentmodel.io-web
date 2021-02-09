import { useMemo, useState } from 'react';
import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';
import Button from '@/src/shared/components/Button/Button';

interface ContentTypesSelectionProps {
  contentModel: z.infer<typeof contentModelSchema>;
  defaultChosenContentTypes?: string[];
  onChange: (contentTypes: string[] | undefined) => void;
  className?: string;
}

const ContentTypesSelection: React.FC<ContentTypesSelectionProps> = (props) => {
  const {
    contentModel,
    defaultChosenContentTypes,
    onChange,
    className,
  } = props;

  const [chosenContentTypes, setChosenContentTypes] = useState<string[]>(
    defaultChosenContentTypes ??
      contentModel
        .filter((contentType) => contentType.internal !== true)
        .map((contentType) => contentType.sys.id),
  );

  const nonInternalContentTypes = useMemo(() => {
    return [
      ...contentModel.filter((contentType) => contentType.internal !== true),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }, [contentModel]);

  return (
    <div className={className}>
      <Button
        size="s"
        grow={false}
        onClick={() => {
          const newChosenContentTypes = nonInternalContentTypes.map(
            (contentType) => contentType.sys.id,
          );

          setChosenContentTypes(newChosenContentTypes);
          onChange(newChosenContentTypes);
        }}
        className="mb-2"
      >
        Select all
      </Button>
      <Button
        size="s"
        grow={false}
        onClick={() => {
          setChosenContentTypes([]);
          onChange([]);
        }}
        className="ml-2 mb-2"
      >
        De-select all
      </Button>
      {nonInternalContentTypes.map((contentType) => (
        <label key={contentType.sys.id} className="block my-2">
          <input
            type="checkbox"
            value={contentType.sys.id}
            checked={chosenContentTypes.includes(contentType.sys.id)}
            onChange={(e) => {
              const newChosenContentTypes = e.target.checked
                ? [...chosenContentTypes, contentType.sys.id]
                : chosenContentTypes.filter(
                    (chosenContentTypeId) =>
                      chosenContentTypeId !== contentType.sys.id,
                  );
              setChosenContentTypes(newChosenContentTypes);
              onChange(newChosenContentTypes);
            }}
          />{' '}
          {contentType.name}
        </label>
      ))}
    </div>
  );
};

export default ContentTypesSelection;
