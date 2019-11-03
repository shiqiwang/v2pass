import {RequestHandler} from 'express';

import {ERROR_CODE, SERVER_ERROR, updateUserData} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const updateUsernameRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey', 'username']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username, id, unlockKey} = req.body;
  updateUserData(id, unlockKey, {username})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update username route error', error);
      res.send(resError);
    });
};

export const updateVerifyRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey', 'verify']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {verify, id, unlockKey} = req.body;
  updateUserData(id, unlockKey, {verify})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update verify route error', error);
      res.send(resError);
    });
};

export const updateEmailRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey', 'email']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {email, id, unlockKey} = req.body;
  updateUserData(id, unlockKey, {email})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update email route error', error);
      res.send(resError);
    });
};

export const updateDataRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey', 'data']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {id, unlockKey, data} = req.body;

  updateUserData(id, unlockKey, {data})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update data route error', error);
      res.send(resError);
    });
};
