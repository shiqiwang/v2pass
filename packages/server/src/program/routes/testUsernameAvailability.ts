import {RequestHandler} from 'express';

import {testUserNameAvailability} from '../dbMethod';
import {generalError, validateError} from '../responseMessage';

import {testUsernameSchema} from './schema';

export const testUsernameAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = testUsernameSchema.validate(req.query);

  if (error) {
    res.send(validateError);
    return;
  }

  const {username} = value;
  testUserNameAvailability(username)
    .then(result => res.send(result))
    .catch(error => {
      console.error('test username availability route error', error);
      res.send(generalError);
    });
};
