import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';

const CLIExportContentModelSchema = z.object({
  contentTypes: contentModelSchema,
});

export default CLIExportContentModelSchema;
