import {Username, Email, MasterPassword, EmailVerifyCode} from '../../types';

type ValidateStatus = 'success' | 'warning' | 'validating' | 'error';
type StepStatus = 'error' | 'wait' | 'process' | 'finish' | undefined;

interface IStepStatus {
  one: StepStatus;
  two: StepStatus;
  three: StepStatus;
}

export interface BaseInfo {
  username: {
    value: Username;
    validateStatus: ValidateStatus;
    help: string;
  };
  email: {
    value: Email;
    validateStatus: ValidateStatus;
    help: string;
  };
  code: {
    value: EmailVerifyCode;
    validateStatus: ValidateStatus;
    help: string;
  };
}

export interface PasswordInfo {
  password: {
    value: MasterPassword;
    validateStatus: ValidateStatus;
    help: string;
  };
  repeatPassword: {
    value: MasterPassword;
    validateStatus: ValidateStatus;
    help: string;
  };
}
