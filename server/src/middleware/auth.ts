import type { NextFunction, OpineRequest, OpineResponse } from 'opine';
import { getCookie } from '~/helper/cookie.ts';
import { verifyJwtToken } from '~/helper/jwt.ts';
import { userRepository } from '~/model/auth.ts';
import { throwError } from '~/middleware/error_handler.ts';

const AUTH_ERROR = {
  status: 401,
  message: 'Authorization Error',
};

export const isAuth = async (
  req: OpineRequest,
  _res: OpineResponse,
  next: NextFunction,
) => {
  let token: string;

  const authHeader = req.get('Authorization');
  const { method, originalUrl } = req;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = getCookie(req.headers, 'token');
  }

  if (!token) {
    return throwError({
      method,
      baseUrl: originalUrl,
      ...AUTH_ERROR,
    });
  }

  try {
    const decoded = await verifyJwtToken(token);
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return throwError({
        method,
        baseUrl: originalUrl,
        ...AUTH_ERROR,
      });
    }
    req.body.userId = user.id;
    req.body.username = user.username;
    req.body.token = token;
    next();
  } catch (_e) {
    return throwError({
      method,
      baseUrl: originalUrl,
      ...AUTH_ERROR,
    });
  }
};
