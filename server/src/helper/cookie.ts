import { getCookies } from '$std/http/cookie.ts';

export function getCookie(headers: Headers, name: string) {
  const cookies = getCookies(headers);
  const cookie = cookies[name];
  return cookie;
}
