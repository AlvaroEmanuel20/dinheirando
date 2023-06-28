import * as Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('income', 'expense').required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid('income', 'expense'),
});
