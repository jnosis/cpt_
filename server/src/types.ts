import type { CorsOptions } from 'cors';

export type MongodbOptions = {
  name: string;
  host: string;
};

export type RateLimitOptions = {
  windowMs: number;
  maxRequest: number;
};

export type Config = {
  cors: CorsOptions;
  mongodb: MongodbOptions;
  rateLimit: RateLimitOptions;
};
