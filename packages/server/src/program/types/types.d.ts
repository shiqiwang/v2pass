import {ObjectId} from 'mongodb';

export interface User {
  id: string;
  username: string;
  email: string;
  data: string | undefined;
}

export interface UserFactor extends User {
  unlockKey: string;
  verify: string;
}

export interface UserDocument {
  _id: ObjectId;
  username: string;
  email: string;
  verify?: string;
  data?: string;
}

export interface Response {
  code: number;
  data: string | Partial<User> | undefined;
}

export interface CanUpdate {
  username: string;
  email: string;
  data: string | undefined;
  verify: string;
}
