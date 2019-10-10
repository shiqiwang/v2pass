import Joi from '@hapi/joi';
import {RequestHandler} from 'express';

import {testUserNameAvailability} from '../requestMethod';
import {generalErrorMessage, validateFailed} from '../responseMessage';

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required(),
});

export const testUsernameAvailabilityRoute: RequestHandler = (req, res) => {
  const {error, value} = schema.validate(req.query);

  if (error) {
    res.send(validateFailed);
    return;
  }

  const {username} = value;
  testUserNameAvailability(username)
    .then(result => res.send({code: 200, message: result}))
    .catch(error => {
      console.error('test username availability error', error);
      res.send(generalErrorMessage);
    });
};
