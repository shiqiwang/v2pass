// 插入测试数据
// 断言
import assert from 'assert';

import mongodb from 'mongodb';

import {UserWithVerify} from './types';

const userDocument: UserWithVerify[] = [
  {
    _id: new mongodb.ObjectId(),
    username: 'emi wang',
    email: 'shiqi.wang@live.com',
    verify: '123',
    // 这里data后面应当是加密后的数据
    data: Buffer.from('data'),
  },
];

// insert a document
export const insertTestDocument = (
  db: mongodb.Db,
  callback: Function,
): void => {
  const collection = db.collection('test');
  collection.insertMany(userDocument, (error, result) => {
    assert.strictEqual(error, null);
    console.log('insert test data');
    callback(result);
  });
};
