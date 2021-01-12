import * as z from 'zod';

import CLIExportContentModelContentModelSchema from '@/src/content-model/types/CLIExportContentModel';
import contentModelSchema from '@/src/content-model/types/contentModel';

const parseCLIExportContentModel = (
  input: unknown,
):
  | { success: false; error: z.ZodError }
  | { success: true; data: z.infer<typeof contentModelSchema> } => {
  const parsed = CLIExportContentModelContentModelSchema.nonstrict().safeParse(
    input,
  );

  if (parsed.success === false) {
    return parsed;
  }

  return {
    success: true,
    data: parsed.data.contentTypes,
  };
};

export default parseCLIExportContentModel;
