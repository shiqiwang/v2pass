import {RequestHandler} from 'express';

import {testUserNameAvailability} from '../requestMethod';
import {
  generalErrorMessage,
  successMessage,
  testUsernameFailed,
  validateFailed,
} from '../responseMessage';

import {testUsernameSchema} from './schema/schema';

export const testUsernameAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = testUsernameSchema.validate(req.query);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {username} = value;
  testUserNameAvailability(username)
    .then(result => {
      if (result) {
        res.send(successMessage);
      } else {
        res.send(testUsernameFailed);
      }
    })
    .catch(error => {
      console.error('test username availability error', error);
      res.send(generalErrorMessage);
    });
};
