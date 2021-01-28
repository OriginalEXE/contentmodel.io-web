import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';
import contentTypeSchema from '@/src/features/content-model/types/contentType';

// What follows are magic numbers, based on the DOM dimensions. Getting them at
// render time would be pretty expensive, so hopefully I remember I've hardcoded
// them here the next time I go and touch the diagram css...
//
//
// Hopefully.
const CONTENT_TYPE_CARD_WIDTH = 336;
const CONTENT_TYPE_CARD_TOP_CONTENT_HEIGHT = 80;
const CONTENT_TYPE_CARD_CONTENT_FIELD_HEIGHT = 36;
const CONTENT_TYPE_CARD_X_AXIS_MARGIN = 80;
const CONTENT_TYPE_CARD_Y_AXIS_MARGIN = 100;

// This function only calculates the initial position of the content types,
// in the end it's up to every author thow those will be positioned at the time
// of publishing
const approximateInitialContentModelPosition = (
  contentModel: z.infer<typeof contentModelSchema>,
): {
  contentTypes: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
} => {
  let contentTypesPosition: Record<
    string,
    {
      x: number;
      y: number;
    }
  > = {};

  if (contentModel.length <= 3) {
    // There are only 3 content types, we can order them all in one row
    contentTypesPosition = contentModel.reduce((prev, current, i) => {
      return {
        ...prev,
        [current.sys.id]: {
          x: i * (CONTENT_TYPE_CARD_WIDTH + CONTENT_TYPE_CARD_X_AXIS_MARGIN),
          y: 0,
        },
      };
    }, {});
  } else {
    const itemsPerRow = Math.floor(Math.sqrt(contentModel.length));

    // Here we assign content types to columns based on their approximate height
    // in order to get a more-or-less equal distribution in the end
    const contentTypesByColumn: z.infer<typeof contentTypeSchema>[][] = [];
    const columnHeights: number[] = [];

    for (let i = 0; i < itemsPerRow; i += 1) {
      contentTypesByColumn.push([]);
      columnHeights.push(0);
    }

    const getContentTypeCardHeight = (
      contentType: z.infer<typeof contentTypeSchema>,
    ): number => {
      return (
        CONTENT_TYPE_CARD_TOP_CONTENT_HEIGHT +
        contentType.fields.length * CONTENT_TYPE_CARD_CONTENT_FIELD_HEIGHT +
        CONTENT_TYPE_CARD_Y_AXIS_MARGIN
      );
    };

    contentModel.forEach((contentType) => {
      const contentTypeHeight = getContentTypeCardHeight(contentType);
      const shortestColumnIndex =
        columnHeights.indexOf([...columnHeights].sort((a, b) => a - b)[0]) || 0;

      columnHeights[shortestColumnIndex] += contentTypeHeight;

      contentTypesByColumn[shortestColumnIndex].push(contentType);
    });

    const columnsY: Record<number, number> = {};

    contentTypesByColumn.forEach((contentTypes, i) => {
      contentTypes.forEach((contentType) => {
        const lastColumnY = columnsY[i] ?? 0;

        const x =
          i * (CONTENT_TYPE_CARD_WIDTH + CONTENT_TYPE_CARD_X_AXIS_MARGIN);
        const y = lastColumnY;

        columnsY[i] = lastColumnY + getContentTypeCardHeight(contentType);

        contentTypesPosition[contentType.sys.id] = {
          x,
          y,
        };
      });
    });
  }

  return {
    contentTypes: contentTypesPosition,
  };
};

export default approximateInitialContentModelPosition;
