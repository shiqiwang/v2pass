import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import uuid from 'uuid';

import {
  DataKey,
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

export class KeyGenerator {
  factor: UnlockKeyVerifyFactor;

  constructor(newFactor: UnlockKeyVerifyFactor) {
    this.factor = newFactor;
  }

  createUnlockKey(): UnlockKey {
    const {id, secretKey, password, email} = this.factor;
    const hashId = CryptoJS.SHA256(id.trim());
    const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
    const hashPassword = CryptoJS.SHA256(password.trim());
    const hashEmail = CryptoJS.SHA256(email.trim());
    const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}${hashEmail}`;
    return CryptoJS.SHA256(plaintextKey).toString();
  }

  createVerify(): Verify {
    const unlockKey = this.createUnlockKey();
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(unlockKey, salt);
    return hash;
  }

  encryptData(data: UsageData): StoreData {
    const dataKey = this.createDataKey();
    return CryptoJS.AES.encrypt(JSON.stringify(data), dataKey).toString();
  }

  decryptData(cipherData: StoreData): UsageData | boolean {
    const dataKey = this.createDataKey();
    const bytes = CryptoJS.AES.decrypt(cipherData, dataKey);
    const json = bytes.toString(CryptoJS.enc.Utf8);

    if (json) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    return false;
  }

  private createDataKey(): DataKey {
    const {id, secretKey, password} = this.factor;
    const hashId = CryptoJS.SHA256(id.trim());
    const hashSecretKey = CryptoJS.SHA256(secretKey.trim());
    const hashPassword = CryptoJS.SHA256(password.trim());
    const plaintextKey = `${hashId}${hashSecretKey}${hashPassword}`;
    return CryptoJS.SHA256(plaintextKey).toString();
  }
}
