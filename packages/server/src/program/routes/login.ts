import {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

import {config} from '../customConfig';
import {ERROR_CODE, SERVER_ERROR, login, loginGetBaseInfo} from '../dbMethod';

import {testSchema} from './schema';

const resError = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

const {tokenKeys} = config;

export const loginGetBaseInfoRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['username']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username} = req.body;
  loginGetBaseInfo(username)
    .then(result => res.send(result))
    .catch(error => {
      console.error('login get base info route error', error);
      res.send(resError);
    });
};

export const loginRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {id, unlockKey} = req.body;
  login(id, unlockKey)
    .then(result => {
      if (result.code) {
        const token = jwt.sign({data: id}, tokenKeys, {expiresIn: 60 * 10});
        req.session!.token = token;
      }

      res.send(result);
    })
    .catch(error => {
      console.error('login route error', error);
      res.send(resError);
    });
};
