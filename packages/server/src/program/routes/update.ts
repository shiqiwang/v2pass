import {RequestHandler} from 'express';

import {ERROR_CODE, SERVER_ERROR, updateAccount, updateData} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const updateAccountRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, [
    'id',
    'unlockKey',
    'username',
    'email',
    'verify',
  ]);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {username, email, verify, id, unlockKey} = req.body;
  updateAccount(id, unlockKey, username, email, verify)
    .then(result => res.send(result))
    .catch(error => {
      console.error('update account route error', error);
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

  updateData(id, unlockKey, data)
    .then(result => res.send(result))
    .catch(error => {
      console.error('update data route error', error);
      res.send(resError);
    });
};
