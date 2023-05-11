import * as Joi from 'joi';

export const createAccountSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
});

export const updateAccountSchema = Joi.object({
  name: Joi.string(),
  amount: Joi.number(),
});
