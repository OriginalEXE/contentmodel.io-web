import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';

const managementAPIContentModelSchema = z.object({
  items: contentModelSchema,
});

export default managementAPIContentModelSchema;
