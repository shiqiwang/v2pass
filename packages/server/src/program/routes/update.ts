import {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

import {config} from '../customConfig';
import {ERROR_CODE, SERVER_ERROR, updateUserData} from '../dbMethod';
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

export const updateVerifyRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['verify']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  const {verify} = req.body;
  updateUserData(id, {verify})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update verify route error', error);
      res.send(resError);
    });
};

export const updateEmailRoute: RequestHandler = (req, res) => {
  const paramsTest = testSchema(req.body, ['email']);

  if (!paramsTest.code) {
    res.send(paramsTest);
    return;
  }

  const token = jwt.verify(req.session!.token, tokenKeys);
  const id = (token as any).data;
  const {email} = req.body;
  updateUserData(id, {email})
    .then(result => res.send(result))
    .catch(error => {
      console.error('update email route error', error);
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
