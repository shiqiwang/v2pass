import bodyParser from 'body-parser';
import session from 'cookie-session';
import express from 'express';
import helmet from 'helmet';

import {config} from './config';
import * as route from './routes';

const app = express();
const jsonParser = bodyParser.json();

app.use(helmet()); // 设置HTTP头部保护app免受一些知名的web攻击

app.use(
  session({
    keys: config.keys,
    maxAge: 1000 * 60 * 15,
  }),
);

app.all('*', jsonParser, route.pretreatRoute);

app.get('/testUsernameAvailability', route.testUsernameAvailabilityRoute);

app.get('/testEmailAvailability', route.testEmailAvailabilityRoute);

app.get('/sendEmail', route.sendEmailRoute);

app.post('/registerBaseInfo', jsonParser, route.registerBaseInfoRoute);

app.post('/register', jsonParser, route.registerRoute);

app.post('/loginGetBaseInfo', jsonParser, route.loginGetBaseInfoRoute);

app.post('/login', jsonParser, route.loginRoute);

app.post('/updateData', jsonParser, route.updateDataRoute);

app.post('/updateUsername', jsonParser, route.updateUsernameRoute);

app.post('/updateEmail', jsonParser, route.updateEmailRoute);

app.post('/updateVerify', jsonParser, route.updateVerifyRoute);

app.get('/getData', route.getDataRoute);

app.use((req, res, next) => {
  console.error('no such route', req.url);
  res.status(404).send('404');
  next();
});

app.listen(3000, () => {
  console.warn('listening on port 3000');
});
