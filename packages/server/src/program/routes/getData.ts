import {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

import {config} from '../../../../config/server';
import {ERROR_CODE, SERVER_ERROR, getData} from '../dbMethod';
import {Response} from '../types';

const {tokenKeys} = config;

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

export const getDataRoute: RequestHandler = (req, res) => {
  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  getData(id)
    .then(result => res.send(result))
    .catch(error => {
      console.error('get data route error', error);
      res.send(resError);
    });
};
