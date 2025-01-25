// backend/src/types/xss-clean.d.ts

import { RequestHandler } from 'express';

declare module 'xss-clean' {
  function xssClean(): RequestHandler;
  export default xssClean;
}
