import {RequestHandler} from 'express';

import {getData} from '../dbMethod';
import {authenticateError, generalError} from '../responseMessage';

export const getDataRoute: RequestHandler = (req, res) => {
  const {id} = req.session!;

  if (!id) {
    res.send(authenticateError);
    return;
  }

  getData(id)
    .then(result => res.send(result))
    .catch(error => {
      console.error('get data route error', error);
      res.send(generalError);
    });
};
