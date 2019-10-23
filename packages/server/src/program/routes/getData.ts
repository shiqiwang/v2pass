import {RequestHandler} from 'express';

import {ERROR_CODE, SERVER_ERROR, getData} from '../dbMethod';
import {Response} from '../types';

import {testSchema} from './schema';

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const getDataRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['id', 'unlockKey']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const {id, unlockKey} = req.body;

  getData(id, unlockKey)
    .then(result => res.send(result))
    .catch(error => {
      console.error('get data route error', error);
      res.send(resError);
    });
};
