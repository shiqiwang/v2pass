import Joi from '@hapi/joi';
import {RequestHandler} from 'express';
import {ObjectId} from 'mongodb';

import {getAuthenticate, updateAccount} from '../requestMethod';
import {
  authenticateFailed,
  generalErrorMessage,
  successMessage,
  validateFailed,
} from '../responseMessage';

const schema = Joi.object({
  id: Joi.string()
    .alphanum()
    .required(),
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  verify: Joi.string().required(),
  unlockKey: Joi.string().required(),
});

export const updateAccountRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.body);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {id, username, email, verify, unlockKey} = value;
  const useId = new ObjectId(id);
  getAuthenticate({_id: useId}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        updateAccount(useId, username, email, verify)
          .then(result => {
            const {nModified, n, ok} = result;

            if (nModified === 1 && n === 1 && ok === 1) {
              res.send(successMessage);
            } else {
              res.send(generalErrorMessage);
            }
          })
          .catch(error => {
            console.error('update account error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('update account authenticate error', error);
      res.send(generalErrorMessage);
    });
};
