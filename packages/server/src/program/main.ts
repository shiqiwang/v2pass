import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';

import * as route from './routes';

const app = express();
const jsonParser = bodyParser.json();

app.use(helmet()); // 设置HTTP头部保护app免受一些知名的web攻击

app.all('*', jsonParser, route.pretreatRoute);

app.get('/testUsernameAvailability', route.testUsernameAvailabilityRoute);

app.get('/testEmailAvailability', route.testEmailAvailabilityRoute);

app.post('/registerBaseInfo', jsonParser, route.registerBaseInfoRoute);

app.post('/register', jsonParser, route.registerRoute);

app.post('/loginGetBaseInfo', jsonParser, route.loginGetBaseInfoRoute);

app.post('/login', jsonParser, route.loginRoute);

app.post('/updateData', jsonParser, route.updateDataRoute);

app.post('/updateAccount', jsonParser, route.updateAccountRoute);

app.post('/getData', jsonParser, route.getDataRoute);

app.use((req, res, next) => {
  console.error('no such route', req.url);
  res.status(404).send('404');
  next();
});

app.listen(3000, () => {
  console.warn('listening on port 3000');
});
