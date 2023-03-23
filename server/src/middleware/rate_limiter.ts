import rateLimit from 'express-rate-limit';
import type {
  NextFunction,
  OpineRequest,
  OpineResponse,
  RequestHandler,
} from 'opine';
import { errorHandler } from '~/middleware/error_handler.ts';
import config from '~/config.ts';

const windowMs = config.rateLimit.windowMs;
const max = config.rateLimit.maxRequest;

export default rateLimit({
  windowMs,
  max,
  message: `You can only make ${max} requests every ${windowMs}ms`,
  handler: (req, res, next, options) => {
    const { method, url } = req as OpineRequest;

    const err = {
      status: options.statusCode,
      method,
      message: options.message,
      baseUrl: url,
    };
    errorHandler(
      err,
      req as OpineRequest,
      res as OpineResponse,
      next as NextFunction,
    );
  },
}) as unknown as RequestHandler;
