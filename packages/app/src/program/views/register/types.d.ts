import {Username, Email, MasterPassword} from '../../types';

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
}

export interface PasswordInfo {
  password: {
    value: MasterPassword;
    validateStatus: ValidateStatus;
  };
  repeatPassword: {
    value: MasterPassword;
    validateStatus: ValidateStatus;
  };
}

export interface EmailVerify {
  email: Email;
  code: number;
  tick: Date;
}
