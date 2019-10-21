import {RequestHandler} from 'express';

import {testEmailAvailability} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {testEmailSchema} from './schema';

export const testEmailAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = testEmailSchema.validate(req.query);

  if (error) {
    res.send(validateError);
    return;
  }

  const {email} = value;
  testEmailAvailability(email)
    .then(result => res.send(result))
    .catch(error => {
      console.error('test email availability route error', error);
      res.send(generalError);
    });
};
