import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  avatar: Joi.string(),
  incomeGoal: Joi.number().positive(),
  expenseGoal: Joi.number().positive(),
  password: Joi.string().min(8),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .when('password', {
      is: Joi.exist(),
      then: Joi.string().valid(Joi.ref('password')).required(),
      otherwise: Joi.string().valid(Joi.ref('password')),
    })
    .messages({
      'any.only': 'Confirm password should be equals to new password',
    }),
});
