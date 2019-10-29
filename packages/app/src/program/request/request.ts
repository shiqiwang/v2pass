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

export async function emailVerifyApi(email: Email): Promise<any> {
  const result = await axios.get(
    `${serverUrl}sendEmail?email=${encodeURIComponent(email)}`,
  );
  const {code, data} = result.data;

  if (code) {
    return true;
  }

  globalError(data);
  return false;
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

export async function registerApi(id: UserId, verify: Verify): Promise<any> {
  const result = await axios.post(`${serverUrl}register`, {
    id,
    verify,
  });
  const {code, data} = result.data;

  if (code) {
    return true;
  }

  globalError(data);
  return false;
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

export async function loginApi(id: UserId, unlockKey: UnlockKey): Promise<any> {
  const result = await axios.post(`${serverUrl}login`, {
    id,
    unlockKey,
  });
  const {code, data} = result.data;

  if (code) {
    return true;
  }

  globalError(data);
  return false;
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

export function updateDataApi(
  id: UserId,
  unlockKey: UnlockKey,
  data: StoreData,
): Promise<any> {
  return axios.post(`${serverUrl}updateData`, {
    id,
    unlockKey,
    data,
  });
}

export function updateAccountApi(
  id: UserId,
  unlockKey: UnlockKey,
  username: Username,
  email: Email,
  verify: Verify,
): Promise<any> {
  return axios.post(`${serverUrl}updateAccount`, {
    id,
    unlockKey,
    username,
    email,
    verify,
  });
}
