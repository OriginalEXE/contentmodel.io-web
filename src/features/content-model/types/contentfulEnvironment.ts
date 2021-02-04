import * as z from 'zod';

import sysSchema from '@/src/features/content-model/types/sys';

export const contentfulEnvironmentSchema = z.object({
  sys: sysSchema,
  name: z.string(),
});

export const contentfulEnvironmentsSchema = z.object({
  items: z.array(contentfulEnvironmentSchema),
});
