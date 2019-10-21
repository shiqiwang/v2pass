import {NextFunction, Request, Response} from 'express';

import {authenticateError} from '../responseMessage';

export function pretreatRoute(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
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

  const {path} = req;

  if (req.method === 'OPTIONS') {
    res.send(200);
    return;
  } else if (
    path !== '/login' &&
    path !== '/registerBaseInfo' &&
    path !== '/registerValidator' &&
    path !== '/testEmailAvailability' &&
    path !== '/testUsernameAvailability'
  ) {
    if (!req.session || !req.session.id) {
      res.send(authenticateError);
      console.error('pretreat route error, req.session', req.session);
      return;
    } else {
      next();
    }
  } else {
    next();
  }
}
