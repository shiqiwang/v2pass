import {RequestHandler} from 'express';

import {updateData} from '../dbMethod';
import {authenticateError, generalError} from '../responseMessage';

export const updateDataRoute: RequestHandler = (req, res) => {
  const {id} = req.session!;

  if (!id) {
    res.send(authenticateError);
    return;
  }

  const {data} = req.body;
  // 后面有加密后，这个Buffer.from(data)记得变为data!!!
  updateData(id, Buffer.from(data))
    .then(result => res.send(result))
    .catch(error => {
      console.error('update data route error', error);
      res.send(generalError);
    });
};
