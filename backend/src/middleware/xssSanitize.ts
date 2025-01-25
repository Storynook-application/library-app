// backend/src/middleware/xssSanitize.ts

import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const xssSanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'OPTIONS' && req.body) { // Skip OPTIONS requests
    for (const prop in req.body) {
      if (typeof req.body[prop] === 'string') {
        req.body[prop] = xss(req.body[prop]);
      }
    }
  }
  next();
};

export default xssSanitize;
