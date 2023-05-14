import * as z from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(2, 'No mínimo 2 caracteres'),
  amount: z.number().min(0),
});
