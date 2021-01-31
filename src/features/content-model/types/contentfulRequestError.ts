import * as z from 'zod';

export const contentfulRequestError = z.object({
  message: z.string(),
  requestId: z.string(),
  sys: z.object({
    id: z.string(),
    type: z.literal('Error'),
  }),
});
