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
