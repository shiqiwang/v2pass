import {
  Username,
  Email,
  SecretKey,
  MasterPassword,
  EmailVerifyCode,
} from '../../types';
import {validateSearch} from 'rc-mentions/lib/util';

type ValidateStatus =
  | 'success'
  | 'warning'
  | 'validating'
  | 'error'
  | undefined;

export interface IChangeUsername {
  value: Username;
  validateStatus: ValidateStatus;
  help: string;
}

export interface IChangeEmail {
  value: Email;
  validateStatus: ValidateStatus;
  help: string;
}

export interface IEmailCode {
  value: EmailVerifyCode;
  validateStatus: ValidateStatus;
  help: string;
}

export interface IChangePassword {
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

export interface IChangeSecretKey {
  value: SecretKey;
}
