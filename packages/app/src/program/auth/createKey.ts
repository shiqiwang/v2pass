import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import uuid from 'uuid';

import {
  DataKeyFactor,
  DerivedKey,
  StorageInfo,
  UnlockKeyVerifyFactor,
  UserAvailableData,
  UserSensitiveInfo,
} from '../types';

export function createSecretKey(): UserSensitiveInfo['secretKey'] {
  return uuid();
}

export function createUnlockKey(
  factor: UnlockKeyVerifyFactor,
): DerivedKey['unlockKey'] {
  const {id, secretKey, password, email} = factor;
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const hashEmail = CryptoJS.SHA256(email.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}${hashEmail}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

export function createVerify(
  factor: UnlockKeyVerifyFactor,
): DerivedKey['verify'] {
  const unlockKey = createUnlockKey(factor);
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(unlockKey, salt);
  return hash;
}

export function createDataKey(factor: DataKeyFactor): DerivedKey['dataKey'] {
  const {id, secretKey, password} = factor;
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

export function encryptData(
  dataKey: DerivedKey['dataKey'],
  data: UserAvailableData['data'],
): StorageInfo['data'] {
  return CryptoJS.AES.encrypt(JSON.stringify(data), dataKey).toString();
}

export function decryptData(
  dataKey: DerivedKey['dataKey'],
  cipherData: StorageInfo['data'],
): UserAvailableData['data'] {
  const bytes = CryptoJS.AES.decrypt(cipherData, dataKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
