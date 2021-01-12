import * as z from 'zod';

import parseCLIExportContentModel from '@/src/content-model/parsing/parseCLIExportContentModel';
import parseManagementAPIContentModel from '@/src/content-model/parsing/parseManagementAPIContentModel';
import contentModelSchema from '@/src/content-model/types/contentModel';

const parseContentModel = (
  input: unknown,
):
  | { success: false }
  | { success: true; data: z.infer<typeof contentModelSchema> } => {
  try {
    const inputAsObject =
      typeof input === 'string' ? JSON.parse(input.trim()) : input;

    // Check if it's a delivery API content model
    let parsed = parseCLIExportContentModel(inputAsObject);

    if (parsed.success === true) {
      return parsed;
    }

    // If not, check if it's a delivery API content model
    parsed = parseManagementAPIContentModel(inputAsObject);

    if (parsed.success === true) {
      return parsed;
    }

    console.log(parsed.error);

    return { success: false };
  } catch (e) {
    return { success: false };
  }
};

export default parseContentModel;
