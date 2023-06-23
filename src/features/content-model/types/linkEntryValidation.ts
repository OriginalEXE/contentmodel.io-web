import * as z from 'zod';

const linkEntryValidationSchema = z.object({
  linkContentType: z.union([z.string(), z.array(z.string())]),
});

export default linkEntryValidationSchema;
