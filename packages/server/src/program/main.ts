// 断言
import assert from 'assert';

import bodyParser from 'body-parser';
import express from 'express';
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

const app = express();
const jsonParser = bodyParser.json();

app.all('*', jsonParser, (req, res, next) => {
  const origins = req.headers.origin;

  if (origins instanceof Array) {
    origins.forEach(origin => {
      res.header('Access-Control-Allow-Origin', origin);
    });
  } else {
    res.header('Access-Control-Allow-Origin', origins);
  }

  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.post('/test', jsonParser, (req, res) => {
  console.log('req.body', req.body);
  res.send('test api');
});

app.get('/testUsernameAvailability/:username', (req, res) => {});

app.get('/testEmailAvailability/:email', (req, res) => {});

app.post('/register', (req, res) => {});

app.post('/updateData', (req, res) => {});

app.post('/updateAccount', (req, res) => {});

app.get('/getData', (req, res) => {});

// app.use((error, req, res, next) => {
//   // 不能为any吗？
//   console.error(error.stack);
//   res.status(500).send('500');
// });

app.use((req, res, next) => {
  res.status(404).send('404');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
