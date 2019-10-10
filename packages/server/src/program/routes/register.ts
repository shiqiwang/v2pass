import Joi from '@hapi/joi';
import {RequestHandler} from 'express';

import {config} from '../customConfig.js';
import {register} from '../requestMethod';
import {
  generalErrorMessage,
  successMessage,
  validateFailed,
} from '../responseMessage';

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  verify: Joi.string().required(),
});

export const registerRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.body);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {username, email, verify} = value;

  register(username, email, verify)
    .then(result => {
      const {n, ok} = result;

      if (n === 1 && ok === 1) {
        res.send(successMessage);
      } else {
        res.send(generalErrorMessage);
      }
    })
    .catch(error => {
      console.error('register error', error);

      if (error.code && error.code === config.customErrorCode) {
        res.send(error);
      } else {
        res.send(generalErrorMessage);
      }
    });
};
