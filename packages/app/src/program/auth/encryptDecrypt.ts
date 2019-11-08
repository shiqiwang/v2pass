import CryptoJS from 'crypto-js';

import {DataKey, StoreData, UsageData} from '../types';

export function encryptData(dataKey: DataKey, data: UsageData): StoreData {
  return CryptoJS.AES.encrypt(JSON.stringify(data), dataKey).toString();
}

export function decryptData(
  dataKey: DataKey,
  cipherData: StoreData,
): UsageData | boolean {
  const bytes = CryptoJS.AES.decrypt(cipherData, dataKey);
  const json = bytes.toString(CryptoJS.enc.Utf8);

  if (json) {
    return JSON.parse(json);
  }

  return false;
}
