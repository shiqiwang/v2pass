// 这个verify（验证器）只能被node查到，但是不能传递到前端
// node和数据库会跑在同一个局域网中，需要保证服务器安全，及时升级系统，开启防火墙等
// 所有用户输入的数据在路由（express）阶段都需要小心处理，看看是否带有恶意代码
// 如果用户是登录的，可以用session验证身份，登录后生成的零时令牌
// 后端的操作应尽量简单，一个操作或者api只做单一的一件事，以免出现漏洞被利用
import mongodb from 'mongodb';

import {config} from './customConfig.js';
import {testEmailFailed, testUsernameFailed} from './responseMessage';
import {UnlockKey, User, UserWithVerify} from './types';

const {database} = config;
const MongoClient = mongodb.MongoClient;
const clientPromise = new MongoClient(database.url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).connect();

const collectionPromise = clientPromise.then(client =>
  client.db(database.name).collection(database.collection),
);

(async (): Promise<void> => {
  const collection = await collectionPromise;
  collection
    .createIndex({username: 1, email: 1}, {unique: true})
    .catch(console.error);
})().catch(error => console.error('collection createIndex error', error));

interface FirstSearchCondition {
  username: User['username'];
}

interface SecondSearchCondition {
  _id: User['_id'];
}

type SearchCondition = FirstSearchCondition | SecondSearchCondition;

export async function getAuthenticate(
  search: SearchCondition,
  unlockKey: UnlockKey,
): Promise<boolean> {
  const collection = await collectionPromise;
  const users = await collection.find(search).toArray();

  if (!users.length) {
    return false;
  }

  if (users[0].verify === unlockKey) {
    // 这里应该用verify验证器来验证unlockKey才对!!!
    return true;
  }

  return false;
}

export async function testUserNameAvailability(
  username: User['username'],
): Promise<boolean> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({username});
  return !num;
}

export async function testEmailAvailability(
  email: User['email'],
): Promise<boolean> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({email});
  return !num;
}

// 注册时要有username email
// verify指的是密码验证器，不能直接把密码传过来保存
export async function register(
  username: User['username'],
  email: User['email'],
  verify: UserWithVerify['verify'],
): Promise<mongodb.InsertOneWriteOpResult['result']> {
  const testUsername = await testUserNameAvailability(username);

  if (!testUsername) {
    throw testUsernameFailed;
  }

  const testEmail = await testEmailAvailability(email);

  if (!testEmail) {
    throw testEmailFailed;
  }

  const collection = await collectionPromise;

  const result = await collection.insertOne({
    username,
    email,
    verify,
    _id: mongodb.ObjectId,
  });

  return result.result;
}

export async function getData(username: User['username']): Promise<any> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();
  return result[0];
}

export async function updateData(
  _id: User['_id'],
  data: User['data'],
): Promise<mongodb.UpdateWriteOpResult['result']> {
  const collection = await collectionPromise;
  const result = await collection.updateOne({_id}, {$set: {data}});
  return result.result;
}

export async function updateAccount(
  _id: User['_id'],
  newUsername: User['username'],
  newEmail: User['email'],
  newVerify: UserWithVerify['verify'],
): Promise<mongodb.UpdateWriteOpResult['result']> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id},
    {$set: {username: newUsername, email: newEmail, verify: newVerify}},
  );
  return result.result;
}
