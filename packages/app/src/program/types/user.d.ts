import {Vault, Target} from './index';

export type Id = string;
export type Username = string;
export type Email = string;
export type SecretKey = string;
export type StoreData = string;
export type Password = string;
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
  id: Id;
  username: Username;
  email: Email;
  secretKey: SecretKey;
  data: StoreData; // encrypt data
}

export interface UserBaseInfo {
  id: Id;
  username: Username;
  email: Email;
}

export interface UserSensitiveInfo {
  password: Password;
  secretKey: SecretKey;
}

export type UserInfo = UserBaseInfo & UserSensitiveInfo;

export interface UserAvailableData extends UserBaseInfo {
  data: UsageData;
}

export interface UnlockKeyVerifyFactor {
  id: Id;
  email: Email;
  password: Password;
  secretKey: SecretKey;
}

export interface DataKeyFactor {
  id: Id;
  password: Password;
  secretKey: SecretKey;
}

export interface DerivedKey {
  unlockKey: UnlockKey;
  verify: Verify;
  dataKey: DataKey;
}
