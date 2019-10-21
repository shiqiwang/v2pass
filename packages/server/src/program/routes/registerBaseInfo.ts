import {RequestHandler} from 'express';

import {registerBaseInfo} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {registerBaseInfoSchema} from './schema';

export const registerBaseInfoRoute: RequestHandler = (req, res) => {
  const {error, value} = registerBaseInfoSchema.validate(req.body);

  if (error) {
    res.send(validateError);
    return;
  }

  const {username, email} = value;

  registerBaseInfo(username, email)
    .then(result => {
      if (result.code === 200) {
        req.session!.id = result.message;
        req.session!.stage = 'register';
      }

      res.send(result);
    })
    .catch(error => {
      console.error('register baseInfo error', error);
      res.send(generalError);
    });
};
