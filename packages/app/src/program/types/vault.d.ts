import {Nominal} from 'tslang';
import Folder from './folder';
type UserId = Nominal<string, 'user-id'>;

interface SharedVault {
  _id: string;
  name: string;
  type: 'shared';
  describe: string;
  administrator: UserId[]; // 管理员有恢复权限，这里涉及密钥的问题，后面要重点关注
  member: UserId[];
  folders: Folder[];
}

export interface VaultGist {
  _id: string;
  name: string;
}

export interface VaultInfo extends VaultGist {
  type: 'private';
  describe: string;
}

export default interface Vault extends VaultInfo {
  folders: Folder[];
}
