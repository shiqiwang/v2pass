import {RequestHandler} from 'express';

import {updateAccount} from '../dbMethod';
import {
  authenticateError,
  generalError,
  validateError,
} from '../responseMessage';

import {updateAccountSchema} from './schema';

export const updateAccountRoute: RequestHandler = (req, res) => {
  const {id} = req.session!;
  const {error, value} = updateAccountSchema.validate(req.body);

  if (!id) {
    res.send(authenticateError);
    return;
  }

  if (error) {
    res.send(validateError);
    return;
  }

  const {username, email, verify} = value;
  updateAccount(id, username, email, verify)
    .then(result => res.send(result))
    .catch(error => {
      console.error('update account route error', error);
      res.send(generalError);
    });
};
