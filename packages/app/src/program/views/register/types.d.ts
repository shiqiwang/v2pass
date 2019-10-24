import {UserInfo} from '../../types';

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
    value: UserInfo['password'];
    validateStatus: ValidateStatus;
  };
  repeatPassword: {
    value: UserInfo['password'];
    validateStatus: ValidateStatus;
  };
}
