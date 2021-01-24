import * as z from 'zod';

const contentTypePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export default contentTypePositionSchema;
