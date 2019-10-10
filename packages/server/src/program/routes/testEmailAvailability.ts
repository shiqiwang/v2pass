import Joi from '@hapi/joi';
import {RequestHandler} from 'express';

import {testEmailAvailability} from '../requestMethod';
import {
  generalErrorMessage,
  successMessage,
  testEmailFailed,
  validateFailed,
} from '../responseMessage';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

export const testEmailAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.query);

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
