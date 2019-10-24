import {Vault, Target} from './index';

export interface StorageInfo {
  id: string;
  username: string;
  email: string;
  secretKey: string;
  data: string; // encrypt data
}

export interface UserBaseInfo {
  id: string;
  username: string;
  email: string;
}

export interface UserSensitiveInfo {
  password: string;
  secretKey: string;
}

export type UserInfo = UserBaseInfo & UserSensitiveInfo;

export interface UserAvailableData extends UserBaseInfo {
  data:
    | {
        targets: Target[];
        vaults: Vault[];
      }
    | undefined;
}

export interface UnlockKeyVerifyFactor {
  id: string;
  email: string;
  password: string;
  secretKey: string;
}

export interface DataKeyFactor {
  id: string;
  password: string;
  secretKey: string;
}

export interface DerivedKey {
  unlockKey: string;
  verify: string;
  dataKey: string;
}
