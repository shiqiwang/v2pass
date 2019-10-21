import {RequestHandler} from 'express';

import {login} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {loginSchema} from './schema';

export const loginRoute: RequestHandler = (req, res) => {
  const {error, value} = loginSchema.validate(req.body);

  if (error) {
    res.send(validateError);
  }

  const {id, unlockKey} = value;
  login(id, unlockKey)
    .then(result => {
      if (result.code === 200) {
        req.session!.id = id;
        req.session!.stage = 'login';
      }

      res.send(result);
    })
    .catch(error => {
      console.error('login route error', error);
      res.send(generalError);
    });
};
