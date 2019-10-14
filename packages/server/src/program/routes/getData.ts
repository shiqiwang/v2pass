import {RequestHandler} from 'express';

import {getAuthenticate, getData} from '../requestMethod';
import {
  authenticateFailed,
  generalErrorMessage,
  validateFailed,
} from '../responseMessage';

import {getDataSchema} from './schema/schema';

export const getDataRoute: RequestHandler = (req, res) => {
  const {error, value} = getDataSchema.validate(req.body);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {username, unlockKey} = value;
  getAuthenticate({username}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        getData(username)
          .then(result => res.send(result))
          .catch(error => {
            console.error('get data error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('get data authenticate error', error);
      res.send(generalErrorMessage);
    });
};
