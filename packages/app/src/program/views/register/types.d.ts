import {UserInfo} from '../../types/user';

type ValidateStatus = 'success' | 'warning' | 'validating' | 'error';
type StepStatus = 'error' | 'wait' | 'process' | 'finish' | undefined;

interface IStepStatus {
  one: StepStatus;
  two: StepStatus;
  three: StepStatus;
}

export interface BaseInfo {
  username: {
    value: UserInfo['username'];
    validateStatus: ValidateStatus;
  };
  email: {
    value: UserInfo['email'];
    validateStatus: ValidateStatus;
  };
}

export interface PasswordInfo {
  password: {
    value: string;
    validateStatus: ValidateStatus;
  };
  repeatPassword: {
    value: string;
    validateStatus: ValidateStatus;
  };
}

export interface Factor {
  id: UserInfo['_id'];
  username: UserInfo['username'];
  password: string;
  email: UserInfo['email'];
  secretKey: string;
  salt: string;
}
