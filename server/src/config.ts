import '$std/dotenv/load.ts';
import type { CorsOptions } from 'cors';
import type { BcryptOptions, Config, MongodbOptions, RateLimitOptions } from '~/types.ts';

function required(key: string, defaultValue?: string): string {
  const value = Deno.env.get(key) || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

const bcrypt: BcryptOptions = {
  saltRound: parseInt(required('BCRYPT_SALT_ROUND', '12')),
}

const cors: CorsOptions = {
  origin: new RegExp(required('CORS_ALLOW_ORIGIN')),
};

const mongodb: MongodbOptions = {
  name: required('MONGODB_NAME')!,
  host: required('MONGODB_HOST')!,
};

const rateLimit: RateLimitOptions = {
  windowMs: parseInt(required('RATE_LIMIT_WINDOW_MS', '60000')),
  maxRequest: parseInt(required('RATE_LIMIT_MAX_REQUEST', '100')),
};

const config: Config = {
  bcrypt,
  cors,
  mongodb,
  rateLimit,
};

export default config;
