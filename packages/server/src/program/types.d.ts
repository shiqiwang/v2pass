import {ObjectId} from 'mongodb';

export interface UserWithVerify extends User {
  verify: string;
}

export interface User {
  _id: ObjectId;
  username: string;
  email: string;
  // 数据都是加密的，在node中为Buffer，在前端为ArrayBuffer，内存中表示为二进制
  data: Buffer;
}

export type UnlockKey = string;
