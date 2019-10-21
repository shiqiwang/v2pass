import {RequestHandler} from 'express';

import {registerValidator} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {registerValidatorSchema} from './schema';

export const registerValidatorRoute: RequestHandler = (req, res) => {
  const {error, value} = registerValidatorSchema.validate(req.body);

  if (error) {
    res.send(validateError);
    return;
  }

  const {verify} = value;
  const id = req.session!.id;
  registerValidator(id, verify)
    .then(result => res.send(result))
    .catch(error => {
      console.error('register validator error', error);
      res.send(generalError);
    });
};
