import {RequestHandler} from 'express';

import {config} from '../customConfig.js';
import {register} from '../requestMethod';
import {
  generalErrorMessage,
  successMessage,
  validateFailed,
} from '../responseMessage';

import {registerSchema} from './schema/schema';

export const registerRoute: RequestHandler = (req, res) => {
  const {error, value} = registerSchema.validate(req.body);

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
