import * as z from 'zod';

const linkEntryValidationSchema = z.object({
  linkContentType: z.array(z.string()),
});

export default linkEntryValidationSchema;
