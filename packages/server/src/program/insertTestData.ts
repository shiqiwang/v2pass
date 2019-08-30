// 插入测试数据
// 断言
import assert from 'assert';

import mongodb from 'mongodb';

import User from './types';

const userDocument: User[] = [
  {
    _id: new mongodb.ObjectId(),
    username: 'emi wang',
    email: 'shiqi.wang@live.com',
    avatar: undefined,
    unlockKey: '123',
    data: {
      targets: [
        {
          _id: new mongodb.ObjectId(),
          displayName: '阿里云',
          entries: [{type: 'website', url: 'https://aliyun.com'}],
        },
      ],
      vaults: [
        {
          _id: new mongodb.ObjectId(),
          name: 'vault',
          type: 'private',
          describe: 'test vault',
          avatar: undefined,
          folders: [
            {
              _id: new mongodb.ObjectId(),
              name: 'test folder',
              describe: 'test folder',
              avatar: undefined,
            },
          ],
        },
      ],
      passwords: [
        {
          _id: new mongodb.ObjectId(),
          items: [],
          collect: true,
          avatar: undefined,
          pass_name: 'test item',
        },
      ],
    },
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
