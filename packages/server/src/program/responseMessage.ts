import {ResponseMessage} from './types';

export const successMessage: ResponseMessage = {
  code: 200,
  message: 'ok',
};

export const generalErrorMessage: ResponseMessage = {
  code: 500,
  message: 'internal server error',
};

export const authenticateFailed: ResponseMessage = {
  code: 401,
  message: 'authenticate failed',
};

export const validateFailed: ResponseMessage = {
  code: 400,
  message: 'params type validate failed',
};

export const testEmailFailed: ResponseMessage = {
  code: 10047,
  message: 'email already exists',
};

export const testUsernameFailed: ResponseMessage = {
  code: 10047,
  message: 'username already exists',
};
