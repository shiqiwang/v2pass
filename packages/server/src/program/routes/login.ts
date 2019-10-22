import {RequestHandler} from 'express';

import {login, loginGetBaseInfo} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {loginGetBaseInfoSchema, loginSchema} from './schema';

export const loginGetBaseInfoRoute: RequestHandler = (req, res) => {
  const {error, value} = loginGetBaseInfoSchema.validate(req.body);

  if (error) {
    res.send(validateError);
    return;
  }

  const {username} = value;
  loginGetBaseInfo(username)
    .then(result => res.send(result))
    .catch(error => {
      console.error('login get base info route error', error);
    });
};

export const loginRoute: RequestHandler = (req, res) => {
  const {error, value} = loginSchema.validate(req.body);

  if (error) {
    res.send(validateError);
    return;
  }

  const {username, unlockKey} = value;
  login(username, unlockKey)
    .then(result => {
      if (result.code === 200) {
        req.session!.id = result.message;
        req.session!.stage = 'login';
      }

      res.send(result);
    })
    .catch(error => {
      console.error('login route error', error);
      res.send(generalError);
    });
};
