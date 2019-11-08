import {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

import {config} from '../config';
import {
  CODE_ERROR,
  ERROR_CODE,
  SERVER_ERROR,
  SESSION_EXPIRES,
  testAuth,
  updateUserData,
} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const {tokenKeys} = config;

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const updateUsernameRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['username']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  const {username} = req.body;
  updateUserData(id, {username})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update username route error', error);
      res.send(resError);
    });
};

export const updateEmailRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, [
    'email',
    'unlockKey',
    'verify',
    'code',
  ]);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {email, unlockKey, verify, code} = req.body;
  const {session} = req;

  if (!session || !session.registerEmail) {
    res.send({code: ERROR_CODE, data: SESSION_EXPIRES});
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

  const token = jwt.verify(session.token, tokenKeys);
  const id = (token as any).data;
  testAuth(id, unlockKey)
    .then(result => {
      if (result.code) {
        updateUserData(id, {email, verify})
          .then(result => res.send(result))
          .catch(error => {
            console.error('update email route error', error);
            res.send(resError);
          });
      } else {
        res.send(result);
      }
    })
    .catch(error => {
      console.error('update email test auth error', error);
      res.send(resError);
    });
};

export const updateDataRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['data']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  const {data} = req.body;

  updateUserData(id, {data})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update data route error', error);
      res.send(resError);
    });
};

export const updateVerifyRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['unlockKey', 'verify']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  const {unlockKey, verify} = req.body;
  testAuth(id, unlockKey)
    .then(result => {
      if (result.code) {
        updateUserData(id, {verify})
          .then(result => res.send(result))
          .catch(error => {
            console.error('update verify route error', error);
          });
      } else {
        res.send(result);
      }
    })
    .catch(error => {
      console.error('update verify route test auth error', error);
      res.send(resError);
    });
};
