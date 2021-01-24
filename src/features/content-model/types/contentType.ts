import * as z from 'zod';

import contentTypeFieldSchema from '@/src/features/content-model/types/contentTypeField';
import sysSchema from '@/src/features/content-model/types/sys';

const contentTypeSchema = z.object({
  sys: sysSchema,
  name: z.string(),
  displayField: z.string(),
  description: z.nullable(z.string()),
  fields: z.array(contentTypeFieldSchema),
  internal: z.optional(z.boolean()),
});

export default contentTypeSchema;
