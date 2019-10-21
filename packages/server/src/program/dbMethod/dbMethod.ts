// 这个verify（验证器）只能被node查到，但是不能传递到前端
// node和数据库会跑在同一个局域网中，需要保证服务器安全，及时升级系统，开启防火墙等
// 所有用户输入的数据在路由（express）阶段都需要小心处理，看看是否带有恶意代码
// 如果用户是登录的，可以用session验证身份，登录后生成的零时令牌
// 后端的操作应尽量简单，一个操作或者api只做单一的一件事，以免出现漏洞被利用
import mongodb, {ObjectId} from 'mongodb';

import {config} from '../customConfig.js';
import * as responseMessage from '../responseMessage';
import {ResponseMessage, UnlockKey, User, UserDocument, Verify} from '../types';

const {database} = config;
const MongoClient = mongodb.MongoClient;
const clientPromise = new MongoClient(database.url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).connect();

const collectionPromise = clientPromise.then(client =>
  client.db(database.name).collection<UserDocument>(database.collection),
);

(async (): Promise<void> => {
  const collection = await collectionPromise;
  collection
    .createIndex({username: 1, email: 1}, {unique: true})
    .catch(console.error);
})().catch(error => console.error('collection createIndex error', error));

export async function testUserNameAvailability(
  username: User['username'],
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({username});

  if (num) {
    return responseMessage.customError('username is occupied!');
  }

  return responseMessage.success(true);
}

export async function testEmailAvailability(
  email: User['email'],
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({email});

  if (num) {
    responseMessage.customError('email is occupied!');
  }

  return responseMessage.success(true);
}

export async function registerBaseInfo(
  username: User['username'],
  email: User['email'],
): Promise<ResponseMessage> {
  const collection = await collectionPromise;

  const result = await collection.insertOne({
    username,
    email,
  });

  const {ok, n} = result.result;

  if (ok === 1 && n === 1) {
    const getId = await collection.find({username}).toArray();

    return responseMessage.success(getId[0]['_id'].toHexString());
  }

  console.error('register validator', result.result);
  return responseMessage.generalError;
}

export async function registerValidator(
  id: User['id'],
  verify: Verify,
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id: new ObjectId(id)},
    {$set: {verify}},
  );
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return responseMessage.success(true);
  }

  console.error('register validator', result);
  return responseMessage.generalError;
}

export async function loginGetBaseInfo(
  username: User['username'],
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();

  if (!result.length) {
    return responseMessage.customError(`${username} does not exist`);
  }

  const {_id, email} = result[0];

  return responseMessage.success({
    id: _id.toHexString(),
    email,
  });
}

export async function login(
  username: User['username'],
  unlockKey: UnlockKey,
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();

  if (!result.length) {
    return responseMessage.customError(`${username} does not exist`);
  }

  const {verify, _id} = result[0];

  if (unlockKey === verify) {
    return responseMessage.success(`${_id.toHexString()}`);
  }

  console.error('login error', result);
  return responseMessage.authenticateError;
}

export async function getData(id: User['id']): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.find({_id: new ObjectId(id)}).toArray();

  return responseMessage.success(result[0].data);
}

export async function updateData(
  id: User['id'],
  data: User['data'],
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id: new ObjectId(id)},
    {$set: {data}},
  );
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return responseMessage.success(true);
  }

  console.error('update data error', result);
  return responseMessage.generalError;
}

export async function updateAccount(
  id: User['id'],
  newUsername: User['username'],
  newEmail: User['email'],
  newVerify: Verify,
): Promise<ResponseMessage> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id: new ObjectId(id)},
    {$set: {username: newUsername, email: newEmail, verify: newVerify}},
  );
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return responseMessage.success(true);
  }

  console.error('update account error', result);
  return responseMessage.generalError;
}
