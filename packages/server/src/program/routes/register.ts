import {RequestHandler} from 'express';

import {
  CODE_ERROR,
  ERROR_CODE,
  SERVER_ERROR,
  SESSION_EXPIRES,
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
  const paramsTest = testSchema(req.body, ['username', 'email', 'code']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username, email, code} = req.body;

  const {session} = req;

  if (!session || !session.registerEmail) {
    res.send({
      code: ERROR_CODE,
      data: SESSION_EXPIRES,
    });
    return;
  }

  // 验证码与邮箱需要绑定
  if (
    session.registerEmail.code !== code ||
    session.registerEmail.email !== email
  ) {
    res.send({
      code: ERROR_CODE,
      data: CODE_ERROR,
    });
    return;
  }

  // 验证码只能用一次
  session.registerEmail = null;
  registerBaseInfo(username, email)
    .then(result => res.send(result))
    .catch(error => {
      console.error('register baseInfo error', error);
      res.send(resError);
    });
};

export const registerRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'verify', 'data']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {verify, id, data} = req.body;
  register(id, verify, data)
    .then(result => res.send(result))
    .catch(error => {
      console.error('register validator error', error);
      res.send(resError);
    });
};
