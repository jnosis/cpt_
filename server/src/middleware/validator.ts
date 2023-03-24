import type { NextFunction, OpineRequest, OpineResponse } from 'opine';
import { z, type ZodRawShape } from 'zod';
import { throwError } from '~/middleware/error_handler.ts';

export const validate = (schema: ZodRawShape) => [async (
  req: OpineRequest,
  _res: OpineResponse,
  next: NextFunction,
) => {
  const validation = z.object(schema);
  const result = await validation.safeParseAsync(req.body);

  if (result.success) {
    return next();
  }

  const { method, originalUrl } = req;

  return throwError({
    method,
    baseUrl: originalUrl,
    status: 400,
    message: result.error.errors[0].message,
  });
}];
