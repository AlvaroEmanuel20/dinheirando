import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'No mínimo 2 caracteres'),
  email: z.string().email({ message: 'Email inválido' }),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'No mínimo 8 caracteres'),
    confirmPassword: z.string().min(8, 'As senhas devem ser iguais'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais',
    path: ['confirmPassword'],
  });

export const updateGoalsSchema = z.object({
  incomeGoal: z.number().min(0.1, 'Insira um valor maior que 0'),
  expenseGoal: z.number().min(0.1, 'Insira um valor maior que 0'),
});
