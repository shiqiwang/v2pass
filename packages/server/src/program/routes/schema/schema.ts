import Joi from '@hapi/joi';
import lodash from 'lodash';

import {ERROR_CODE, PARAMS_VALIDATE_FAILED, SUCCESS_CODE} from '../../dbMethod';
import {Response, UserFactor} from '../../types';

type Params = 'id' | 'username' | 'email' | 'data' | 'unlockKey' | 'verify';

const factor = {
  id: Joi.string().required(),
  username: Joi.string()
    .pattern(/^\w{5,30}$/)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  data: Joi.string()
    .base64()
    .required(),
  unlockKey: Joi.string().required(),
  verify: Joi.string().required(),
};

export function testSchema(
  values: Partial<UserFactor>,
  testArray: Params[],
): Response {
  const schema = Joi.object(lodash.pick(factor, testArray));
  const {error} = schema.validate(values);

  if (error) {
    return {
      code: ERROR_CODE,
      message: PARAMS_VALIDATE_FAILED,
    };
  }

  return {
    code: SUCCESS_CODE,
  };
}
