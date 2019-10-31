import {Vault, Target} from './index';

export type UserId = string;
export type Username = string;
export type Email = string;
export type SecretKey = string;
export type StoreData = string;
export type MasterPassword = string;
export type EmailVerifyCode = string;
export type UsageData =
  | {
      targets: Target[];
      vaults: Vault[];
    }
  | undefined;
export type Verify = string;
export type UnlockKey = string;
export type DataKey = string;

export interface StorageInfo {
  id: UserId;
  username: Username;
  email: Email;
  secretKey: SecretKey;
  data: StoreData; // encrypt data
}

export interface UserBaseInfo {
  id: UserId;
  username: Username;
  email: Email;
  secretKey: SecretKey;
}

export interface UserSensitiveInfo {
  password: MasterPassword;
}

export type UserInfo = UserBaseInfo & UserSensitiveInfo;

export interface UserAvailableData extends UserBaseInfo {
  data: UsageData;
}

export interface UnlockKeyVerifyFactor {
  id: UserId;
  email: Email;
  password: MasterPassword;
  secretKey: SecretKey;
}

export interface DataKeyFactor {
  id: UserId;
  password: MasterPassword;
  secretKey: SecretKey;
}

export interface DerivedKey {
  unlockKey: UnlockKey;
  verify: Verify;
  dataKey: DataKey;
}
