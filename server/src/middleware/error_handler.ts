import type { ErrorRequestHandler as ErrorHandler } from 'opine';
import { convertToMessage } from '~/util/message.ts';
import log from '~/util/logger.ts';

type Err = {
  status: number;
  method: string;
  baseUrl: string;
  param?: string;
  message: string;
};

export const throwError = (options: Err) => {
  throw options;
};

export const errorHandler: ErrorHandler = (err: Err, _req, res, _next) => {
  const msg = convertToMessage(err);
  log.error(msg);
  res
    .setStatus(err.status || 500)
    .json({ message: err.message || 'Something is wrong' });
};
