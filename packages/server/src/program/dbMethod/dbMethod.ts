import bcrypt from 'bcryptjs';
import mongodb, {ObjectId} from 'mongodb';

import {config} from '../customConfig.js';
import {UnlockKey, User, UserDocument, Verify} from '../types';

import * as message from './const';

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

async function testAuth(id: User['id'], unlockKey: UnlockKey): Promise<string> {
  const collection = await collectionPromise;
  const result = await collection.find({_id: new ObjectId(id)}).toArray();

  if (!result.length) {
    return message.NOT_EXIST;
  }

  const {verify} = result[0];

  if (!verify) {
    return message.REGISTRATION_NOT_COMPLETED;
  } else if (bcrypt.compareSync(unlockKey, verify)) {
    return message.SUCCESS;
  }

  return message.AUTH_FAILED;
}

export async function testUserNameAvailability(
  username: User['username'],
): Promise<string> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({username});

  if (num) {
    return message.USERNAME_EXIST;
  }

  return message.SUCCESS;
}

export async function testEmailAvailability(
  email: User['email'],
): Promise<string> {
  const collection = await collectionPromise;
  const num = await collection.countDocuments({email});

  if (num) {
    return message.EMAIL_EXIST;
  }

  return message.SUCCESS;
}

export async function registerBaseInfo(
  username: User['username'],
  email: User['email'],
): Promise<string> {
  const collection = await collectionPromise;
  const testUsername = await testUserNameAvailability(username);
  const testEmail = await testEmailAvailability(email);

  if (testUsername !== message.SUCCESS) {
    return message.USERNAME_EXIST;
  }

  if (testEmail !== message.SUCCESS) {
    return message.EMAIL_EXIST;
  }

  const result = await collection.insertOne({
    username,
    email,
  });

  const {ok, n} = result.result;

  if (ok === 1 && n === 1) {
    const getId = await collection.find({username}).toArray();

    return getId[0]['_id'].toHexString();
  }

  console.error('register validator', result.result);
  return message.SERVER_ERROR;
}

export async function registerValidator(
  id: User['id'],
  verify: Verify,
): Promise<string> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id: new ObjectId(id)},
    {$set: {verify}},
  );
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return message.SUCCESS;
  }

  console.error('register validator', result);
  return message.SERVER_ERROR;
}

export async function loginGetBaseInfo(
  username: User['username'],
): Promise<string | object> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();

  if (!result.length) {
    return message.NOT_EXIST;
  }

  const {_id, email} = result[0];

  return {
    id: _id.toHexString(),
    email,
  };
}

export async function login(
  id: User['id'],
  unlockKey: UnlockKey,
): Promise<string> {
  const result = await testAuth(id, unlockKey);
  return result;
}

export async function getData(
  id: User['id'],
  unlockKey: UnlockKey,
): Promise<string | Buffer | undefined> {
  const getAuth = await testAuth(id, unlockKey);

  if (getAuth === message.SUCCESS) {
    const collection = await collectionPromise;
    const result = await collection.find({_id: new ObjectId(id)}).toArray();
    return result[0].data;
  }

  return getAuth;
}

export async function updateData(
  id: User['id'],
  unlockKey: UnlockKey,
  data: User['data'],
): Promise<string> {
  const getAuth = await testAuth(id, unlockKey);

  if (getAuth === message.SUCCESS) {
    const collection = await collectionPromise;
    const result = await collection.updateOne(
      {_id: new ObjectId(id)},
      {$set: {data}},
    );
    const {nModified, ok} = result.result;

    if (nModified === 1 && ok === 1) {
      return message.SUCCESS;
    }

    console.error('update data error', result);
    return message.SERVER_ERROR;
  }

  return getAuth;
}

export async function updateAccount(
  id: User['id'],
  verify: Verify,
  newUsername: User['username'],
  newEmail: User['email'],
  newVerify: Verify,
): Promise<string> {
  const getAuth = await testAuth(id, verify);

  if (getAuth === message.SUCCESS) {
    const collection = await collectionPromise;
    const result = await collection.updateOne(
      {_id: new ObjectId(id)},
      {
        $set: {username: newUsername, email: newEmail, verify: newVerify},
      },
    );
    const {nModified, ok} = result.result;

    if (nModified === 1 && ok === 1) {
      return message.SUCCESS;
    }

    return message.SERVER_ERROR;
  }

  return getAuth;
}
