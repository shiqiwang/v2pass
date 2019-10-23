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

interface ResponseMessage {
  code: number;
  message: string;
}

interface ResponseData {
  code: number;
  data?: string | Partial<User>;
}

export type Response = ResponseMessage | ResponseData;
