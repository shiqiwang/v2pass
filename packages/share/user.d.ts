import Target from './target';
import Password from './password';
import Vault from './vault';
/**
 * 使用Target接口时，前端和后端都需引入_id
 */
export default interface User {
  username: string;
  avatar: File; // 用户头像文件
  data: {
    // 这种把folder存在user下的方式是否不大好，有shared后不还扩展。存folderIds[]是否更好
    // 同理targetIds[]和passwordIds[]呢？
    targets: Target[];
    vaults: Vault[];
    passwords: Password[];
  };
  keySet: null; // 暂时folder只做private，有shared后keySet: KeySet
}

interface KeySet {
  uuid: string;
  encSymmetricKey: JsonWebKey;
  encryptedBy: string;
  publicKey: JsonWebKey;
  encPrivateKey: JsonWebKey;
} // 1password是这些，可能还会有具体区别，比如个人的，作为管理员的，等等
