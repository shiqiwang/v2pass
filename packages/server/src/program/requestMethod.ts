// 这个verify（验证器）只能被node查到，但是不能传递到前端
// node和数据库会跑在同一个局域网中，需要保证服务器安全，及时升级系统，开启防火墙等
// 所有用户输入的数据在路由（express）阶段都需要小心处理，看看是否带有恶意代码
// 如果用户是登录的，可以用session验证身份，登录后生成的零时令牌
// 后端的操作应尽量简单，一个操作或者api只做单一的一件事，以免出现漏洞被利用
import mongodb from 'mongodb';

import {UnlockKey, User, UserWithVerify} from './types';

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'v2pass';
const client = new MongoClient(url);
const db = client.db(dbName);
const collection = db.collection('test');

// 使用索引保证插入数据的username和email的唯一性
collection
  .createIndex({username: 1, email: 1}, {unique: true})
  .catch(console.error);

function authenticate(
  unlockKey: UnlockKey,
  verify: UserWithVerify['verify'],
): boolean {
  if (verify === unlockKey) {
    // 这里应该用verify验证器来验证unlockKey才对!!!
    return true;
  }

  return false;
}

async function getUserById(_id: User['_id']): Promise<any> {
  const result = await collection.find({_id}).toArray();

  if (!result.length) {
    throw Error('not found');
  }

  return result[0];
}

async function getUserByUsernameEmail(
  username: User['username'],
  email: User['email'],
): Promise<any> {
  const result = await collection.find({username, email}).toArray();

  if (!result.length) {
    throw Error('not found');
  }

  return result[0];
}

export async function testUserNameAvailability(
  username: User['username'],
): Promise<boolean> {
  const num = await collection.count({username});
  return !num;
}

export async function testEmailAvailability(
  email: User['email'],
): Promise<boolean> {
  const num = await collection.count({email});
  return !num;
}

// 注册时要有username email
// verify指的是密码验证器，不能直接把密码传过来保存
export async function register(
  username: User['username'],
  email: User['email'],
  verify: UserWithVerify['verify'],
): Promise<mongodb.InsertOneWriteOpResult> {
  return collection.insertOne({
    username,
    email,
    verify,
    _id: mongodb.ObjectId,
  });
}

export async function updateData(
  _id: User['_id'],
  data: User['data'],
  unlockKey: UnlockKey,
): Promise<mongodb.UpdateWriteOpResult> {
  const user = await getUserById(_id);
  const {verify} = user;
  const result = await authenticate(unlockKey, verify);

  if (result) {
    return collection.updateOne({_id}, {$set: {data}});
  }

  throw Error('authentication failed');
}

// verify为新验证器，unlockKey需要传递过来用旧验证器验证一边先
// 更改账户信息时，前端也需要查重用户名邮箱，且会导致unlockKey和verify的变化
export async function updateAccount(
  _id: User['_id'],
  newUsername: User['username'],
  newEmail: User['email'],
  newVerify: UserWithVerify['verify'],
  unlockKey: UnlockKey,
): Promise<mongodb.UpdateWriteOpResult> {
  const user = await getUserById(_id);
  const {verify} = user;
  const result = await authenticate(unlockKey, verify);

  if (result) {
    return collection.updateOne(
      {_id},
      {$set: {username: newUsername, email: newEmail, verify: newVerify}},
    );
  }

  throw Error('authentication failed');
}

export async function getData(
  username: User['username'],
  email: User['email'],
  unlockKey: UnlockKey,
): Promise<any> {
  const user = await getUserByUsernameEmail(username, email);
  const {verify} = user;
  const result = await authenticate(unlockKey, verify);

  if (result) {
    return user.data;
  }

  throw Error('authentication failed');
}
