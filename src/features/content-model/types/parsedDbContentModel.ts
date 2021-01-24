import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';
import { DbContentModel } from '@/src/features/content-model/types/dbContentModel';
import contentModelPositionSchema from '@/src/features/diagram/types/contentModelPosition';

export type ParsedDbContentModel = Omit<
  DbContentModel,
  'model' | 'position'
> & {
  model: z.infer<typeof contentModelSchema>;
  position: z.infer<typeof contentModelPositionSchema>;
};
