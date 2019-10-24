import axios from 'axios';

import {Email, Id, StoreData, UnlockKey, Username, Verify} from '../types';

const serverUrl = 'http://localhost:3000/';

export function testUsernameApi(username: Username): Promise<any> {
  return axios.get(
    `${serverUrl}testUsernameAvailability?username=${encodeURIComponent(
      username,
    )}`,
  );
}

export function testEmailApi(email: Email): Promise<any> {
  return axios.get(
    `${serverUrl}testEmailAvailability?email=${encodeURIComponent(email)}`,
  );
}

export function registerBaseInfoApi(
  username: Username,
  email: Email,
): Promise<any> {
  return axios.post(`${serverUrl}registerBaseInfo`, {
    username,
    email,
  });
}

export function registerApi(id: Id, verify: Verify): Promise<any> {
  return axios.post(`${serverUrl}register`, {
    id,
    verify,
  });
}

export function loginGetBaseInfo(username: Username): Promise<any> {
  return axios.post(`${serverUrl}loginGetBaseInfo`, {username});
}

export function loginApi(id: Id, unlockKey: UnlockKey): Promise<any> {
  return axios.post(`${serverUrl}login`, {
    id,
    unlockKey,
  });
}

export function getDataApi(id: Id, unlockKey: UnlockKey): Promise<any> {
  return axios.post(`${serverUrl}getData`, {
    id,
    unlockKey,
  });
}

export function updateDataApi(
  id: Id,
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
  id: Id,
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
