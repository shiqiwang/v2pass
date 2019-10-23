import {RequestHandler} from 'express';

import {
  ERROR_CODE,
  SERVER_ERROR,
  register,
  registerBaseInfo,
} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const registerBaseInfoRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['username', 'email']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username, email} = req.body;

  registerBaseInfo(username, email)
    .then(result => res.send(result))
    .catch(error => {
      console.error('register baseInfo error', error);
      res.send(resError);
    });
};

export const registerRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'verify']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {verify, id} = req.body;
  register(id, verify)
    .then(result => res.send(result))
    .catch(error => {
      console.error('register validator error', error);
      res.send(resError);
    });
};
