import * as Joi from 'joi';

export const createTransactionSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
  createdAt: Joi.date().required(),
  type: Joi.string().valid(['income', 'expense']).required(),
  category: Joi.string().required(),
  account: Joi.string().required(),
});

export const updateTransactionSchema = Joi.object({
  name: Joi.string(),
  value: Joi.number(),
  createdAt: Joi.date(),
  type: Joi.string().valid(['income', 'expense']),
  category: Joi.string(),
  account: Joi.string(),
});
