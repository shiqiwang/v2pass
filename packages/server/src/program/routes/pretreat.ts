import {NextFunction, Request, Response} from 'express';

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

  if (req.method === 'OPTIONS') {
    res.send(200);
    return;
  }

  next();
}
