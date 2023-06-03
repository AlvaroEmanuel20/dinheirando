import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.union([
      z.string().min(2, 'No mínimo 2 caracteres'),
      z.string().max(0),
    ]),
    email: z.union([
      z.string().email({ message: 'Email inválido' }),
      z.string().max(0),
    ]),
    password: z.union([
      z.string().min(8, 'No mínimo 8 caracteres'),
      z.string().max(0),
    ]),
    confirmPassword: z.string(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });
