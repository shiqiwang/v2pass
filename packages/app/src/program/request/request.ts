import {message} from 'antd';
import axios from 'axios';

import {
  Email,
  EmailVerifyCode,
  StoreData,
  UnlockKey,
  UserId,
  Username,
  Verify,
} from '../types';

const serverUrl = 'http://localhost:3000/';

function globalError(str: string): void {
  message.error(str);
}

function dealWithResult(result: any): boolean {
  const {code, data} = result.data;

  if (code) {
    return true;
  }

  globalError(data);
  return false;
}

export async function testUsernameApi(username: Username): Promise<any> {
  const result = await axios.get(
    `${serverUrl}testUsernameAvailability?username=${encodeURIComponent(
      username,
    )}`,
  );
  return result.data;
}

export async function testEmailApi(email: Email): Promise<any> {
  const result = await axios.get(
    `${serverUrl}testEmailAvailability?email=${encodeURIComponent(email)}`,
  );
  return result.data;
}

export async function emailVerifyApi(email: Email): Promise<boolean> {
  const result = await axios.get(
    `${serverUrl}sendEmail?email=${encodeURIComponent(email)}`,
  );
  return dealWithResult(result);
}

export async function registerBaseInfoApi(
  username: Username,
  email: Email,
  code: EmailVerifyCode,
): Promise<any> {
  const result = await axios.post(`${serverUrl}registerBaseInfo`, {
    username,
    email,
    code,
  });
  const {data} = result;

  if (data.code) {
    return data.data;
  }

  globalError(data.data);
  return false;
}

export async function registerApi(
  id: UserId,
  verify: Verify,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}register`, {
    id,
    verify,
  });
  return dealWithResult(result);
}

export async function loginGetBaseInfo(username: Username): Promise<any> {
  const result = await axios.post(`${serverUrl}loginGetBaseInfo`, {username});
  const {code, data} = result.data;

  if (code) {
    return data;
  }

  globalError(data);
  return false;
}

export async function loginApi(
  id: UserId,
  unlockKey: UnlockKey,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}login`, {
    id,
    unlockKey,
  });
  return dealWithResult(result);
}

export async function getDataApi(
  id: UserId,
  unlockKey: UnlockKey,
): Promise<any> {
  const result = await axios.post(`${serverUrl}getData`, {
    id,
    unlockKey,
  });
  const {code, data} = result.data;

  if (code) {
    return data;
  }

  globalError(data);
  return false;
}

export async function updateDataApi(
  id: UserId,
  unlockKey: UnlockKey,
  data: StoreData,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}updateData`, {
    id,
    unlockKey,
    data,
  });
  return dealWithResult(result);
}

export async function updateUsernameApi(
  id: UserId,
  unlockKey: UnlockKey,
  username: Username,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}updateUsername`, {
    id,
    unlockKey,
    username,
  });
  return dealWithResult(result);
}

export async function updateEmailApi(
  id: UserId,
  unlockKey: UnlockKey,
  email: Email,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}updateEmail`, {
    id,
    unlockKey,
    email,
  });
  return dealWithResult(result);
}

export async function updateVerify(
  id: UserId,
  unlockKey: UnlockKey,
  verify: Verify,
): Promise<boolean> {
  const result = await axios.post(`${serverUrl}updateVerify`, {
    id,
    unlockKey,
    verify,
  });
  return dealWithResult(result);
}
