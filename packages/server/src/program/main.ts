import bodyParser from 'body-parser';
// session的设定时机？验证身份以后？
import session from 'cookie-session';
import express from 'express';
import {ObjectId} from 'mongodb';

import {
  getAuthenticate,
  getData,
  register,
  testEmailAvailability,
  testUserNameAvailability,
  updateAccount,
  updateData,
} from './requestMethod';
import {
  authenticateFailed,
  generalErrorMessage,
  successMessage,
} from './responseMessage';

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

  // 服务器支持的所有头信息字段
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

// 是不是要有debounce？如果恶意的人一直发请求会不会让服务崩溃？
app.get('/testUsernameAvailability/:username', (req, res) => {
  const {username} = req.params;
  testUserNameAvailability(username)
    .then(result => res.send({code: 200, message: result}))
    .catch(error => {
      console.error('test username availability error', error);
      res.send(generalErrorMessage);
    });
});

app.get('/testEmailAvailability/:email', (req, res) => {
  const {email} = req.params;
  testEmailAvailability(email)
    .then(result => res.send({code: 200, message: result}))
    .catch(error => {
      console.error('test email availability error', error);
      res.send(generalErrorMessage);
    });
});

app.post('/register', jsonParser, (req, res) => {
  const {username, email, verify} = req.body;
  register(username, email, verify)
    .then(result => {
      const {n, ok} = result;

      if (n === 1 && ok === 1) {
        res.send(successMessage);
      } else {
        res.send(generalErrorMessage);
      }
    })
    .catch(error => {
      console.error('register error', error);
      res.send(generalErrorMessage);
    });
});

app.post('/updateData', jsonParser, (req, res) => {
  const {data, id, unlockKey} = req.body;
  const useId = new ObjectId(id);
  getAuthenticate({_id: useId}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        // 后面有加密后，这个Buffer.from(data)记得变为data!!!
        updateData(useId, Buffer.from(data))
          .then(result => {
            const {nModified, n, ok} = result;
            console.log('result', result);

            if (nModified === 1 && n === 1 && ok === 1) {
              res.send(successMessage);
            } else {
              res.send(generalErrorMessage);
            }
          })
          .catch(error => {
            console.error('update data error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('update data authenticate error', error);
      res.send(generalErrorMessage);
    });
});

app.post('/updateAccount', jsonParser, (req, res) => {
  const {id, username, email, verify, unlockKey} = req.body;
  const useId = new ObjectId(id);
  getAuthenticate({_id: useId}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        updateAccount(useId, username, email, verify)
          .then(result => {
            const {nModified, n, ok} = result;

            if (nModified === 1 && n === 1 && ok === 1) {
              res.send(successMessage);
            } else {
              res.send(generalErrorMessage);
            }
          })
          .catch(error => {
            console.error('update account error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('update account authenticate error', error);
      res.send(generalErrorMessage);
    });
});

app.post('/getData', jsonParser, (req, res) => {
  const {username, email, unlockKey} = req.body;
  getAuthenticate({username, email}, unlockKey)
    .then(result => {
      if (!result) {
        res.send(authenticateFailed);
      } else {
        getData(username, email)
          .then(result => res.send(result))
          .catch(error => {
            console.error('get data error', error);
            res.send(generalErrorMessage);
          });
      }
    })
    .catch(error => {
      console.error('get data authenticate error', error);
      res.send(generalErrorMessage);
    });
});

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
