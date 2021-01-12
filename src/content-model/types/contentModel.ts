import * as z from 'zod';

import contentTypeSchema from '@/src/content-model/types/contentType';

const contentModelSchema = z.array(contentTypeSchema);

export default contentModelSchema;
