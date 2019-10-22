import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import uuid from 'uuid';

interface UnlockKeyFactor {
  id: string;
  secretKey: string;
  password: string;
  email: string;
}

interface DataKeyFactor {
  id: string;
  secretKey: string;
  password: string;
}

// 创建用户的secret key
export function createSecretKey(): string {
  return uuid();
}

// 生成用户login, getData, updateData, updateAccount时验证身份的密钥
export function createUnlockKey(factor: UnlockKeyFactor): string {
  const {id, secretKey, password, email} = factor;
  const hashId = sha256(id.trim());
  const hashSecretKey = sha256(secretKey.trim());
  const hashPassword = sha256(password.trim());
  const hashEmail = sha256(email.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}${hashEmail}`;
  return sha256(plaintextKey).toString();
}

// 生成用户身份密钥的验证器
export function createVerify(factor: UnlockKeyFactor): string {
  const unlockKey = createUnlockKey(factor);
  const saltRounds = 10;
  const hash = bcrypt.hashSync(unlockKey, saltRounds);
  return hash;
  // check unlockKey
  // bcrypt.compareSync(unlockKey, hash);
}

// 生成加密，解密数据用的密钥
export function createDataKey(factor: DataKeyFactor): string {
  const {id, secretKey, password} = factor;
  const hashId = sha256(id.trim());
  const hashSecretKey = sha256(secretKey.trim());
  const hashPassword = sha256(password.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}`;
  return sha256(plaintextKey).toString();
}

export function encryptData(key: string, data: object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptData(key: string, cipherText: string): object {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
