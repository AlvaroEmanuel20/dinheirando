import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'No mínimo 2 caracteres'),
  type: z.enum(['income', 'expense']),
});
