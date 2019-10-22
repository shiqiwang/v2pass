import {RequestHandler} from 'express';

import {updateAccount} from '../dbMethod';
import {authenticateError, generalError} from '../responseMessage';

export const updateAccountRoute: RequestHandler = (req, res) => {
  const {id} = req.session!;

  if (!id) {
    res.send(authenticateError);
    return;
  }

  const {username, email, verify} = req.body;
  updateAccount(id, username, email, verify)
    .then(result => res.send(result))
    .catch(error => {
      console.error('update account route error', error);
      res.send(generalError);
    });
};
