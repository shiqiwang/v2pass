import Target from './target';
import Password from './password';
import Vault from './vault';
import Folder from './folder';
/**
 * 使用Target接口时，前端和后端都需引入_id
 */

export interface UserInfo {
  _id: string;
  username: string;
  email: string; // 前后端应该验证email格式
  unlockKey: string; // 登录 解锁密钥，应当是master password和 secret key的衍生物
}

export type Verify = string;

export default interface User extends UserInfo {
  data: {
    // 这种把folder存在user下的方式是否不大好，有shared后不还扩展。存folderIds[]是否更好
    // 同理targetIds[]和passwordIds[]呢？
    targets: Target[];
    vaults: Vault[];
  };
  // keySet: undefined; 暂时folder只做private，有shared后keySet: KeySet
}

interface KeySet {
  uuid: string;
  encSymmetricKey: JsonWebKey; // 为什么一开始可以用JsonWebKey？？？ 又可以了？？？
  encryptedBy: string;
  publicKey: JsonWebKey;
  encPrivateKey: JsonWebKey;
} // 1password是这些，可能还会有具体区别，比如个人的，作为管理员的，等等
