import * as z from 'zod';

import contentTypePositionSchema from '@/src/features/diagram/types/contentTypePosition';

const contentModelPositionSchema = z.object({
  contentTypes: z.record(contentTypePositionSchema),
});

export default contentModelPositionSchema;
