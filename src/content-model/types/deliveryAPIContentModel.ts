import * as z from 'zod';

import contentModelSchema from '@/src/content-model/types/contentModel';

const deliveryAPIContentModelSchema = z.object({
  items: contentModelSchema,
});

export default deliveryAPIContentModelSchema;
