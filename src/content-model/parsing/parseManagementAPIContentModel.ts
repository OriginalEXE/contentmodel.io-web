import * as z from 'zod';

import contentModelSchema from '@/src/content-model/types/contentModel';
import deliveryAPIContentModelSchema from '@/src/content-model/types/deliveryAPIContentModel';

const parseManagementAPIContentModel = (
  input: unknown,
):
  | { success: false; error: z.ZodError }
  | { success: true; data: z.infer<typeof contentModelSchema> } => {
  const parsed = deliveryAPIContentModelSchema.nonstrict().safeParse(input);

  if (parsed.success === false) {
    return parsed;
  }

  return {
    success: true,
    data: parsed.data.items,
  };
};

export default parseManagementAPIContentModel;
