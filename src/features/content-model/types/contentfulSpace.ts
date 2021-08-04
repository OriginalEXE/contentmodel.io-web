import * as z from 'zod';

import sysSchema from '@/src/features/content-model/types/sys';

export const contentfulSpaceSchema = z.object({
  sys: sysSchema.extend({
    organization: z.object({
      sys: sysSchema,
    }),
  }),
  name: z.string(),
});

export const contentfulSpacesSchema = z.object({
  items: z.array(contentfulSpaceSchema),
  total: z.number(),
});
