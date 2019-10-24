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
  return axios.post(`${serverUrl}register`, {
    verify,
  });
}

export function loginGetBaseInfo(username: UserInfo['username']): Promise<any> {
  return axios.post(`${serverUrl}loginGetBaseInfo`, {username});
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

export function getDataApi(): Promise<any> {
  return axios.get(`${serverUrl}getData`);
}

export function updateDataApi(data: string): Promise<any> {
  return axios.post(`${serverUrl}updateData`, {
    data,
  });
}

export function updateAccountApi(
  username: UserInfo['username'],
  email: UserInfo['email'],
  verify: Verify,
): Promise<any> {
  return axios.post(`${serverUrl}updateAccount`, {
    username,
    email,
    verify,
  });
}
