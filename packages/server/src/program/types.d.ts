import FolderWithoutId from '../../../share/folder';
import PasswordWithoutId from '../../../share/password';
import TargetWithoutId from '../../../share/target';
import {ObjectId} from 'mongodb';
import {Nominal} from 'tslang';
type UserId = Nominal<string, 'user-id'>;

interface Id {
  _id: ObjectId;
}

type Folder = FolderWithoutId & Id;
type Password = PasswordWithoutId & Id;
type Target = TargetWithoutId & Id;
type Vault = (SharedVault | PrivateVault) & Id;

export default interface User {
  _id: ObjectId;
  username: string;
  email: string;
  avatar: any;
  unlockKey: string;
  data: {
    targets: Target[];
    vaults: Vault[];
    passwords: Password[];
  };
}

interface SharedVault {
  name: string;
  type: 'shared';
  describe: string;
  administrator: UserId[]; // 管理员有恢复权限，这里涉及密钥的问题，后面要重点关注
  member: UserId[];
  avatar: any; // 头像
  folders: Folder[];
}

interface PrivateVault {
  name: string;
  type: 'private';
  describe: string;
  avatar: any;
  folders: Folder[];
}
