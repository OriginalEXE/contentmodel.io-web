import * as z from 'zod';

import contentModelSchema from '@/src/features/content-model/types/contentModel';
import managementAPIContentModelSchema from '@/src/features/content-model/types/managementAPIContentModel';

const parseManagementAPIContentModel = (
  input: unknown,
):
  | { success: false; error: z.ZodError }
  | { success: true; data: z.infer<typeof contentModelSchema> } => {
  const parsed = managementAPIContentModelSchema.nonstrict().safeParse(input);

  if (parsed.success === false) {
    return parsed;
  }

  return {
    success: true,
    data: parsed.data.items,
  };
};

export default parseManagementAPIContentModel;
