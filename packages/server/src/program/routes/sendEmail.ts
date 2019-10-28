import {RequestHandler} from 'express';

import {ERROR_CODE, SERVER_ERROR} from '../dbMethod';
import {createRandomCode, emailVerify} from '../emailVerify';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const sendEmailRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.query, ['email']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {email} = req.query;
  const code = createRandomCode();
  emailVerify(email, code)
    .then(result => {
      req.session!.emailVerifyCode = code;
      res.send(result);
    })
    .catch(error => {
      console.error('email verify route error', error);
      res.send(resError);
    });
};
