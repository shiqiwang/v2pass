import {Nominal} from 'tslang';
import {Folder} from './index';
// type UserId = Nominal<string, 'user-id'>;

// interface SharedVault {
//   id: string;
//   name: string;
//   type: 'shared';
//   describe: string;
//   administrator: UserId[]; // 管理员有恢复权限，这里涉及密钥的问题，后面要重点关注
//   member: UserId[];
//   folders: Folder[];
// }
export interface Vault {
  id: string;
  name: string;
  type: 'private';
  describe: string;
  folders: Folder[];
}
