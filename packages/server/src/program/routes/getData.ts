import {RequestHandler} from 'express';

import {getData} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {getDataSchema} from './schema';

export const getDataRoute: RequestHandler = (req, res) => {
  const {error, value} = getDataSchema.validate(req.body);

  if (error) {
    res.send(validateError);
    return;
  }

  const {id} = value;
  getData(id)
    .then(result => res.send(result))
    .catch(error => {
      console.error('get data route error', error);
      res.send(generalError);
    });
};
