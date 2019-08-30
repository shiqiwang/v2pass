// 断言
import assert from 'assert';
import {createServer} from 'http';

import mongodb from 'mongodb';

import {insertTestDocument} from './insertTestData';

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'v2pass';
const client = new MongoClient(url);
// collect
client.connect(error => {
  assert.strictEqual(null, error);
  console.log('database collect');
  const db = client.db(dbName);
  // 注意，每次重启服务器，test document都应当清空重新插入新数据，不让数据积累
  db.dropCollection('test')
    .then()
    .catch();
  insertTestDocument(db, () => {
    db.collection('test')
      .findOne({username: 'emi wang'})
      .then(data => {
        const id = String(data._id); // 转化id为客户端所用
        console.log('id', typeof id, id);
      })
      .catch();
  });
});

let server = createServer((req, res) => {
  console.log(req);
  res.end('hello');
});

server.listen(1337);
