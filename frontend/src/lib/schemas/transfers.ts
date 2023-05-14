import * as z from 'zod';

export const createTransferSchema = z
  .object({
    fromAccount: z.string().min(2, 'Campo obrigatório'),
    toAccount: z.string().min(2, 'Campo obrigatório'),
    createdAt: z.date(),
    value: z.number().min(0.1, 'Insira um valor maior que 0'),
  })
  .refine((data) => data.fromAccount !== data.toAccount, {
    message: 'Conta de destino é igual a de origem',
    path: ['toAccount'],
  });
