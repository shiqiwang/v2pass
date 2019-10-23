import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
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
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const hashEmail = CryptoJS.SHA256(email.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}${hashEmail}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

// 生成用户身份密钥的验证器
export function createVerify(factor: UnlockKeyFactor): string {
  const unlockKey = createUnlockKey(factor);
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(unlockKey, salt);
  return hash;
  // check unlockKey
  // bcrypt.compareSync(unlockKey, hash);
}

// 生成加密，解密数据用的密钥
export function createDataKey(factor: DataKeyFactor): string {
  const {id, secretKey, password} = factor;
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

export function encryptData(key: string, data: object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptData(key: string, cipherText: string): object {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
