import {RequestHandler} from 'express';
import {ObjectId} from 'mongodb';

import {getAuthenticate, updateAccount} from '../requestMethod';
import {
  authenticateFailed,
  generalErrorMessage,
  successMessage,
  validateFailed,
} from '../responseMessage';

import {updateAccountSchema} from './schema/schema';

export const updateAccountRoute: RequestHandler = (req, res) => {
  const {error, value} = updateAccountSchema.validate(req.body);

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
