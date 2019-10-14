import {RequestHandler} from 'express';

import {testEmailAvailability} from '../requestMethod';
import {
  generalErrorMessage,
  successMessage,
  testEmailFailed,
  validateFailed,
} from '../responseMessage';

import {testEmailSchema} from './schema/schema';

export const testEmailAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = testEmailSchema.validate(req.query);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {email} = value;
  testEmailAvailability(email)
    .then(result => {
      if (result) {
        res.send(successMessage);
      } else {
        res.send(testEmailFailed);
      }
    })
    .catch(error => {
      console.error('test email availability error', error);
      res.send(generalErrorMessage);
    });
};
