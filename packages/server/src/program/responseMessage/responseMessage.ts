import {ResponseMessage} from '../types';

export const success = (
  message: ResponseMessage['message'],
): ResponseMessage => {
  return {
    code: 200,
    message,
  };
};

export const generalError: ResponseMessage = {
  code: 500,
  message: 'internal server error',
};

export const authenticateError: ResponseMessage = {
  code: 401,
  message: 'authenticate failed',
};

export const validateError: ResponseMessage = {
  code: 400,
  message: 'params type validate failed',
};

export const customError = (
  message: ResponseMessage['message'],
): ResponseMessage => {
  return {
    code: 10047,
    message,
  };
};
