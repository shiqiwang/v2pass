import bodyParser from 'body-parser';
import express from 'express';

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
