import {Nominal} from 'tslang';
type UserId = Nominal<string, 'user-id'>;

type Vault = PrivateVault;

interface SharedVault {
  _id: string;
  name: string;
  type: 'shared';
  describe: string;
  administrator: UserId[]; // 管理员有恢复权限，这里涉及密钥的问题，后面要重点关注
  member: UserId[];
}

interface PrivateVault {
  _id: string;
  name: string;
  type: 'private';
  describe: string;
}

export default Vault;
