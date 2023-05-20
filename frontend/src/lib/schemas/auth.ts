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

export const recoverPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'No mínimo 8 caracteres'),
    confirmPassword: z.string().min(8, 'As senhas devem ser iguais'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });
