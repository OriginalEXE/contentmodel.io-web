import * as z from 'zod';

import contentModelSchema from '@/src/content-model/types/contentModel';
import { DbContentModel } from '@/src/content-model/types/dbContentModel';
import contentModelPositionSchema from '@/src/diagram/types/contentModelPosition';

export type ParsedDbContentModel = Omit<
  DbContentModel,
  'model' | 'position'
> & {
  model: z.infer<typeof contentModelSchema>;
  position: z.infer<typeof contentModelPositionSchema>;
};
