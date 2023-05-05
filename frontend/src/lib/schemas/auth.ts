import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'No mínimo 2 caracteres'),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, 'No mínimo 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, 'No mínimo 8 caracteres'),
});
