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

interface IPassword {
  value: MasterPassword;
  validateStatus: ValidateStatus;
  help: string;
}

export interface IChangeUsername {
  value: Username;
  validateStatus: ValidateStatus;
  help: string;
}

export interface IChangeEmail {
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
  password: IPassword;
}

export interface IChangePassword {
  password: IPassword;
  repeatPassword: IPassword;
}

export interface IChangeSecretKey {
  value: SecretKey;
}
