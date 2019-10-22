import {RequestHandler} from 'express';

import {updateData} from '../dbMethod';
import {
  authenticateError,
  generalError,
  validateError,
} from '../responseMessage';

import {updateDataSchema} from './schema';

export const updateDataRoute: RequestHandler = (req, res) => {
  const {id} = req.session!;
  const {error, value} = updateDataSchema.validate(req.body);

  if (!id) {
    res.send(authenticateError);
    return;
  }

  if (error) {
    res.send(validateError);
    return;
  }

  const {data} = value;
  // 后面有加密后，这个Buffer.from(data)记得变为data!!!
  updateData(id, Buffer.from(data))
    .then(result => res.send(result))
    .catch(error => {
      console.error('update data route error', error);
      res.send(generalError);
    });
};
