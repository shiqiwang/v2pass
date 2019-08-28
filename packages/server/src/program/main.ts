import {createServer} from 'http';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost: 27017';
const dbName = 'v2pass';
const client = new MongoClient(url);
// connect
client.connect(error => {
  assert.equal(null, error);
  console.log('Collected successfully to server');
  const db = client.db(dbName);
  client.close();
});
// insert a document
const insertDocuments = (db, callback): void => {
  const collection = db.collection('documents');
  collection.insertMany([{}, {}, {}], (error, result) => {
    assert.equal(error, null);
    assert.equal(3, result.result.n);
    assert.equal();
  });
};

let server = createServer((req, res) => {
  res.end('hello');
});

server.listen(1337);
