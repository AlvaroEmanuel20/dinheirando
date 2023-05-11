import * as Joi from 'joi';

export const createTransferSchema = Joi.object({
  value: Joi.number().required(),
  createdAt: Joi.date().required(),
  fromAccount: Joi.string().required(),
  toAccount: Joi.string().required(),
});

export const updateTransferSchema = Joi.object({
  value: Joi.number(),
  createdAt: Joi.date(),
  fromAccount: Joi.string(),
  toAccount: Joi.string(),
});
