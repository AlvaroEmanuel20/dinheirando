import * as z from 'zod';

export const createTransactionSchema = z.object({
  name: z.string().min(2, 'No mínimo 2 caracteres'),
  category: z.string().min(2, 'Campo obrigatório'),
  account: z.string().min(2, 'Campo obrigatório'),
  createdAt: z.date(),
  value: z.number().min(0.1, 'Insira um valor maior que 0'),
  type: z.enum(['income', 'expense']),
});
