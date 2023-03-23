import '$std/dotenv/load.ts';
import type { CorsOptions } from 'cors';
import type { Config, RateLimitOptions } from '~/types.ts';

function required(key: string, defaultValue?: string): string {
  const value = Deno.env.get(key) || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

const cors: CorsOptions = {
  origin: new RegExp(required('CORS_ALLOW_ORIGIN')),
};

const rateLimit: RateLimitOptions = {
  windowMs: parseInt(required('RATE_LIMIT_WINDOW_MS', '60000')),
  maxRequest: parseInt(required('RATE_LIMIT_MAX_REQUEST', '100')),
};

const config: Config = {
  cors,
  rateLimit,
};

export default config;
