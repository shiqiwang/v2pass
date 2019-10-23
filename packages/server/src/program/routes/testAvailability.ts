import {RequestHandler} from 'express';

import {
  ERROR_CODE,
  SERVER_ERROR,
  testEmailAvailability,
  testUserNameAvailability,
} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const testUsernameAvailabilityRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.query, ['username']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username} = req.query;
  testUserNameAvailability(username)
    .then(result => res.send(result))
    .catch(error => {
      console.error('test username availability route error', error);
      res.send(resError);
    });
};

export const testEmailAvailabilityRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.query, ['email']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {email} = req.query;
  testEmailAvailability(email)
    .then(result => res.send(result))
    .catch(error => {
      console.error('test email availability route error', error);
      res.send(resError);
    });
};
