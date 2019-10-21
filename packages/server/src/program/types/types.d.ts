import {ObjectId} from 'mongodb';

export interface User {
  id: string;
  username: string;
  email: string;
  // 数据都是加密的，在node中为Buffer，在前端为ArrayBuffer，内存中表示为二进制
  data: Buffer | undefined;
}

export interface UserDocument {
  _id: ObjectId;
  username: string;
  email: string;
  verify?: string;
  data?: Buffer;
}

export type UnlockKey = string;
export type Verify = string;

export interface ResponseMessage {
  code: number;
  message: string | boolean | User['data'];
}
