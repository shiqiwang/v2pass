import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import uuid from 'uuid';

import {
  DataKey,
  DataKeyFactor,
  SecretKey,
  StoreData,
  UnlockKey,
  UnlockKeyVerifyFactor,
  UsageData,
  Verify,
} from '../types';

export function createSecretKey(): SecretKey {
  return uuid();
}

export function createUnlockKey(factor: UnlockKeyVerifyFactor): UnlockKey {
  const {id, secretKey, password, email} = factor;
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const hashEmail = CryptoJS.SHA256(email.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}${hashEmail}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

export function createVerify(factor: UnlockKeyVerifyFactor): Verify {
  const unlockKey = createUnlockKey(factor);
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(unlockKey, salt);
  return hash;
}

export function createDataKey(factor: DataKeyFactor): DataKey {
  const {id, secretKey, password} = factor;
  const hashId = CryptoJS.SHA256(id.trim());
  const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
  const hashPassword = CryptoJS.SHA256(password.trim());
  const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}`;
  return CryptoJS.SHA256(plaintextKey).toString();
}

export function encryptData(dataKey: DataKey, data: UsageData): StoreData {
  return CryptoJS.AES.encrypt(JSON.stringify(data), dataKey).toString();
}

export function decryptData(
  dataKey: DataKey,
  cipherData: StoreData,
): UsageData {
  const bytes = CryptoJS.AES.decrypt(cipherData, dataKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
