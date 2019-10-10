import Joi from '@hapi/joi';
import {RequestHandler} from 'express';
import {ObjectId} from 'mongodb';

import {getAuthenticate, updateData} from '../requestMethod';
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
  data: Joi.string()
    .base64()
    .required(),
  unlockKey: Joi.string().required(),
});

export const updateDataRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.body);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {data, id, unlockKey} = value;
  const useId = new ObjectId(id);
  getAuthenticate({_id: useId}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        // 后面有加密后，这个Buffer.from(data)记得变为data!!!
        updateData(useId, Buffer.from(data))
          .then(result => {
            const {nModified, n, ok} = result;

            if (nModified === 1 && n === 1 && ok === 1) {
              res.send(successMessage);
            } else {
              res.send(generalErrorMessage);
            }
          })
          .catch(error => {
            console.error('update data error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('update data authenticate error', error);
      res.send(generalErrorMessage);
    });
};
