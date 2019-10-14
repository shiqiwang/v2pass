import {RequestHandler} from 'express';

import {getAuthenticate} from '../requestMethod';
import {
  authenticateFailed,
  successMessage,
  validateFailed,
} from '../responseMessage';

import {loginSchema} from './schema/schema';

export const loginRoute: RequestHandler = (req, res) => {
  const {error, value} = loginSchema.validate(req.body);

  if (error) {
    res.send(validateFailed);
  }

  const {username, unlockKey} = value;
  getAuthenticate(username, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        res.send(successMessage);
      }
    })
    .catch(error => {
      console.error('login error', error);
    });
};
