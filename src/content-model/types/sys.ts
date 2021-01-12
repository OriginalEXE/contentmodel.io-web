import * as z from 'zod';

const sysSchema = z.object({
  id: z.string(),
  type: z.string(),
});

export default sysSchema;
