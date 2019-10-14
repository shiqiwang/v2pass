import Joi from '@hapi/joi';

const username = Joi.string()
  .pattern(/^\w{5,30}$/)
  .required();

const email = Joi.string()
  .email()
  .required();

const id = Joi.string()
  .alphanum()
  .required();

const data = Joi.string()
  .base64()
  .required();

const unlockKey = Joi.string().required();

const verify = Joi.string().required();

export const testUsernameSchema = Joi.object({
  username,
});

export const testEmailSchema = Joi.object({
  email,
});

export const registerSchema = Joi.object({
  username,
  email,
  verify,
});

export const loginSchema = Joi.object({
  username,
  unlockKey,
});

export const getDataSchema = Joi.object({
  username,
  unlockKey,
});

export const updateAccountSchema = Joi.object({
  id,
  username,
  email,
  verify,
  unlockKey,
});

export const updateDataSchema = Joi.object({
  id,
  data,
  unlockKey,
});
