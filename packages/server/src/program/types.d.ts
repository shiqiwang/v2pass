import {ObjectId} from 'mongodb';

export default interface User {
  _id: ObjectId;
  username: string;
  email: string;
  avatar: any;
  unlockKey: string;
  data: object; // 这里用了加密后，数据类型不是object，记得更改
}
