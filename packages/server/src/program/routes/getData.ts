import Joi from '@hapi/joi';
import {RequestHandler} from 'express';

import {getAuthenticate, getData} from '../requestMethod';
import {
  authenticateFailed,
  generalErrorMessage,
  validateFailed,
} from '../responseMessage';

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  unlockKey: Joi.string().required(),
});

export const getDataRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.body);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {username, email, unlockKey} = value;
  getAuthenticate({username, email}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        getData(username, email)
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
