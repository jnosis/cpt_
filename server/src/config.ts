import '$std/dotenv/load.ts';
import type { CorsOptions } from 'cors';
import type { Config } from '~/types.ts';

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

const config: Config = {
  cors,
};

export default config;
