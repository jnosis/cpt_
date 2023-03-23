import type { ParamsDictionary, RequestHandler } from 'opine';
import type { CorsOptions } from 'cors';

export type Config = {
  bcrypt: BcryptOptions;
  jwt: JwtOptions;
  cors: CorsOptions;
  mongodb: MongodbOptions;
  rateLimit: RateLimitOptions;
};
