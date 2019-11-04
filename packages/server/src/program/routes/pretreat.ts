import {NextFunction, Request, Response} from 'express';

import {AUTH_FAILED, ERROR_CODE} from '../dbMethod';
import {Response as ResponseMessage} from '../types';

const authError: ResponseMessage = {
  code: ERROR_CODE,
  data: AUTH_FAILED,
};

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
  }

  if (path.includes('update') || path.includes('get')) {
    if (!req.session || !req.session.token) {
      res.send(authError);
      return;
    }
  }

  if (path === '/register') {
    if (!req.session || !req.session.registerEmail) {
      res.send(authError);
      return;
    }
  }

  next();
}
