import type { NextFunction, OpineRequest, OpineResponse } from 'opine';
import { Elmedeno } from '~/util/elmedeno.ts';

const elmedeno = new Elmedeno({ expectCt: null });

export const elmedenoMiddleware = async (
  req: OpineRequest,
  res: OpineResponse,
  next: NextFunction,
) => {
  await elmedeno.protect(req, res);
  next();
};
