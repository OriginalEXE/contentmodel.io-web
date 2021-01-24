import * as z from 'zod';

import sysSchema from '@/src/features/content-model/types/sys';

export const contentfulOrganizationSchema = z.object({
  sys: sysSchema,
  name: z.string(),
});

export const contentfulOrganizationsSchema = z.object({
  items: z.array(contentfulOrganizationSchema),
});
