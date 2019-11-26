import CryptoJS from 'crypto-js';

import {DataKey, StoreData, UsageData} from '../types';

export function encryptData(dataKey: DataKey, data: UsageData): StoreData {
  return CryptoJS.AES.encrypt(JSON.stringify(data), dataKey).toString();
}

export function decryptData(
  dataKey: DataKey,
  cipherData: StoreData,
): UsageData | false {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherData, dataKey);
    const data = CryptoJS.enc.Utf8;
    const json = bytes.toString(data);

    if (json) {
      return JSON.parse(json);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
