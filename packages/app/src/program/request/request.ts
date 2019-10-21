import axios from 'axios';

import {UserInfo, Verify} from '../types/user';

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

export function registerBaseInfoApi(
  username: UserInfo['username'],
  email: UserInfo['email'],
): Promise<any> {
  return axios.post(`${serverUrl}registerBaseInfo`, {
    username,
    email,
  });
}

export function registerValidatorApi(verify: Verify): Promise<any> {
  return axios.post(`${serverUrl}registerValidator`, {
    verify,
  });
}

export function loginApi(id: UserInfo['_id'], unlockKey: string): Promise<any> {
  return axios.post(`${serverUrl}login`, {
    id,
    unlockKey,
  });
}

export function getDataApi(id: UserInfo['_id']): Promise<any> {
  return axios.post(`${serverUrl}getData`, {id});
}

// 这里data应当是加密后的base64
export function updateDataApi(id: UserInfo['_id'], data: string): Promise<any> {
  return axios.post(`${serverUrl}updateData`, {
    id,
    data,
  });
}

export function updateAccountApi(
  id: UserInfo['_id'],
  username: UserInfo['username'],
  email: UserInfo['email'],
  verify: Verify,
): Promise<any> {
  return axios.post(`${serverUrl}updateAccount`, {
    id,
    username,
    email,
    verify,
  });
}
