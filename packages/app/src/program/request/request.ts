import axios from 'axios';

import UserInfo from '../types/user';

const serverUrl = 'http://localhost:3000/';

export function testUsernameApi(username: UserInfo['username']): Promise<any> {
  return axios.get(
    `${serverUrl}testUsernameAvailability?username=${encodeURIComponent(
      username,
    )}`,
  );
}

export function testEmailApi(email: UserInfo['email']): Promise<any> {
  return axios.get(
    `${serverUrl}testEmailAvailability?email=${encodeURIComponent(email)}`,
  );
}

export function registerApi(
  username: UserInfo['username'],
  email: UserInfo['email'],
  verify: string,
): Promise<any> {
  return axios.post(`${serverUrl}register`, {
    username,
    email,
    verify,
  });
}

export function loginApi(
  username: UserInfo['username'],
  unlockKey: string,
): Promise<any> {
  return axios.post(`${serverUrl}login`, {
    username,
    unlockKey,
  });
}

export function getDataApi(
  username: UserInfo['username'],
  unlockKey: string,
): Promise<any> {
  return axios.post(`${serverUrl}getData`, {
    username,
    unlockKey,
  });
}

// 这里data应当是加密后的base64
export function updateDataApi(
  id: UserInfo['_id'],
  data: string,
  unlockKey: string,
): Promise<any> {
  return axios.post(`${serverUrl}updateData`, {
    id,
    data,
    unlockKey,
  });
}

export function updateAccountApi(
  id: UserInfo['_id'],
  username: UserInfo['username'],
  email: UserInfo['email'],
  verify: string,
  unlockKey: string,
): Promise<any> {
  return axios.post(`${serverUrl}updateAccount`, {
    id,
    username,
    email,
    verify,
    unlockKey,
  });
}
