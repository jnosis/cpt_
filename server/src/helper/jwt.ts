import type { Header, Payload } from 'djwt';
import { create, getNumericDate, verify } from 'djwt';
import config from '~/config.ts';

const { jwt } = config;

const exp = getNumericDate(jwt.expiresInSec);
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(jwt.secretKey),
  { name: 'HMAC', hash: 'SHA-512' },
  true,
  ['sign', 'verify'],
);

export async function createJwtToken(id: string) {
  const headers: Header = {
    alg: 'HS512',
    typ: 'JWS',
  };
  const payload: Payload = { exp, id };

  return await create(headers, payload, key);
}

export async function verifyJwtToken(token: string) {
  try {
    return await verify(token, key);
  } catch (_e) {
    return _e;
  }
}
