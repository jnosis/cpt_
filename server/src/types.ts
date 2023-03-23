import type { CorsOptions } from 'cors';

export type RateLimitOptions = {
  windowMs: number;
  maxRequest: number;
};

export type Config = {
  cors: CorsOptions;
  rateLimit: RateLimitOptions;
};
