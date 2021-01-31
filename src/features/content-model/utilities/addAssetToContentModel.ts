import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';

const addAssetToContentModel = (
  contentModel: z.infer<typeof contentModelSchema>,
): z.infer<typeof contentModelSchema> => {
  return [
    ...contentModel,
    {
      name: 'Asset',
      sys: {
        type: 'ContentType',
        id: '_internal_asset',
      },
      description: null,
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          localized: true,
          required: false,
          disabled: false,
          omitted: false,
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          localized: true,
          required: false,
          disabled: false,
          omitted: false,
        },
        {
          id: 'file',
          name: 'File',
          type: 'File',
          localized: true,
          required: false,
          disabled: false,
          omitted: false,
        },
      ],
      internal: true,
    },
  ];
};

export default addAssetToContentModel;
