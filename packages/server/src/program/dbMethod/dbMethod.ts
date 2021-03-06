import bcrypt from 'bcryptjs';
import mongodb, {ObjectId} from 'mongodb';

import {config} from '../config';
import {CanUpdate, Response, UserDocument, UserFactor} from '../types';

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

export async function testAuth(
  id: UserFactor['id'],
  unlockKey: UserFactor['unlockKey'],
): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.find({_id: new ObjectId(id)}).toArray();

  if (!result.length) {
    return {
      code: message.ERROR_CODE,
      data: message.NOT_EXIST,
    };
  }

  const {verify} = result[0];

  if (!verify) {
    return {
      code: message.ERROR_CODE,
      data: message.REGISTRATION_NOT_COMPLETED,
    };
  } else if (bcrypt.compareSync(unlockKey, verify)) {
    return {
      code: message.SUCCESS_CODE,
      data: message.SUCCESS,
    };
  }

  return {
    code: message.ERROR_CODE,
    data: message.AUTH_FAILED,
  };
}

export async function testUserNameAvailability(
  username: UserFactor['username'],
): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();

  if (result.length) {
    if (result[0].verify) {
      return {
        code: message.ERROR_CODE,
        data: message.USERNAME_EXIST,
      };
    }

    const removeNotCompleted = await collection.deleteOne({
      username,
      verify: {$exists: false},
    });
    const {ok, n} = removeNotCompleted.result;

    if (ok === 1 && n === 1) {
      return {
        code: message.SUCCESS_CODE,
        data: message.SUCCESS,
      };
    }

    return {
      code: message.ERROR_CODE,
      data: message.USERNAME_EXIST,
    };
  }

  return {
    code: message.SUCCESS_CODE,
    data: message.SUCCESS,
  };
}

export async function testEmailAvailability(
  email: UserFactor['email'],
): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.find({email}).toArray();

  if (result.length) {
    if (result[0].verify) {
      return {
        code: message.ERROR_CODE,
        data: message.EMAIL_EXIST,
      };
    }

    const removeNotCompleted = await collection.deleteOne({
      email,
      verify: {$exists: false},
    });
    const {n, ok} = removeNotCompleted.result;

    if (ok === 1 && n === 1) {
      return {
        code: message.SUCCESS_CODE,
        data: message.SUCCESS,
      };
    }

    return {
      code: message.ERROR_CODE,
      data: message.EMAIL_EXIST,
    };
  }

  return {
    code: message.SUCCESS_CODE,
    data: message.SUCCESS,
  };
}

export async function registerBaseInfo(
  username: UserFactor['username'],
  email: UserFactor['email'],
): Promise<Response> {
  const collection = await collectionPromise;
  const testUsername = await testUserNameAvailability(username);
  const testEmail = await testEmailAvailability(email);

  if (!testUsername.code) {
    return testUsername;
  }

  if (!testEmail.code) {
    return testEmail;
  }

  const result = await collection.insertOne({
    username,
    email,
  });

  const {ok, n} = result.result;

  if (ok === 1 && n === 1) {
    const getId = await collection.find({username}).toArray();

    return {
      code: message.SUCCESS_CODE,
      data: {
        id: getId[0]['_id'].toHexString(),
      },
    };
  }

  console.error('register validator', result.result);

  return {
    code: message.ERROR_CODE,
    data: message.SERVER_ERROR,
  };
}

export async function register(
  id: UserFactor['id'],
  verify: UserFactor['verify'],
  data: UserDocument['data'],
): Promise<Response> {
  const collection = await collectionPromise;
  const _id = new ObjectId(id);
  const getInfo = await collection.find({_id}).toArray();

  if (!getInfo.length) {
    return {
      code: message.ERROR_CODE,
      data: message.NOT_EXIST,
    };
  }

  if (getInfo[0].verify) {
    return {
      code: message.ERROR_CODE,
      data: message.REGISTRATION_HAS_COMPLETED,
    };
  }

  const result = await collection.updateOne({_id}, {$set: {verify, data}});
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return {
      code: message.SUCCESS_CODE,
      data: message.SUCCESS,
    };
  }

  console.error('register validator', result);

  return {
    code: message.ERROR_CODE,
    data: message.SERVER_ERROR,
  };
}

export async function loginGetBaseInfo(
  username: UserFactor['username'],
): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.find({username}).toArray();

  if (!result.length) {
    return {
      code: message.ERROR_CODE,
      data: message.NOT_EXIST,
    };
  }

  const {_id, email} = result[0];

  return {
    code: message.SUCCESS_CODE,
    data: {
      id: _id.toHexString(),
      email,
    },
  };
}

export async function login(
  id: UserFactor['id'],
  unlockKey: UserFactor['unlockKey'],
): Promise<Response> {
  const result = await testAuth(id, unlockKey);
  return result;
}

export async function getData(id: UserFactor['id']): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.find({_id: new ObjectId(id)}).toArray();

  return {
    code: message.SUCCESS_CODE,
    data: result[0].data,
  };
}

export async function updateUserData(
  id: UserFactor['id'],
  data: Partial<CanUpdate>,
): Promise<Response> {
  const collection = await collectionPromise;
  const result = await collection.updateOne(
    {_id: new ObjectId(id)},
    {$set: data},
  );
  const {nModified, ok} = result.result;

  if (nModified === 1 && ok === 1) {
    return {
      code: message.SUCCESS_CODE,
      data: message.SUCCESS,
    };
  }

  console.error(`update one: ${data}`, result);

  return {
    code: message.ERROR_CODE,
    data: message.SERVER_ERROR,
  };
}
