import type { RoomCreateInfo, SignUpInfo, UserInfo } from '~/types';

const MIN_PASSWORD_LEN = 8;

function validateUsername(str: string): boolean {
  return str.length > 0 && !str.includes(' ');
}

function validatePassword(password: string): boolean {
  return (password.length >= MIN_PASSWORD_LEN) && !password.includes(' ');
}

function validateEmail(email: string): boolean {
  const emailRegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return emailRegExp.test(email);
}

export function validateUser(name: keyof SignUpInfo, value: string): boolean {
  switch (name) {
    case 'username':
      return validateUsername(value);
    case 'password':
      return validatePassword(value);
    case 'email':
      return validateEmail(value);
    default:
      throw new Error(`User property(${name}) is undefined`);
  }
}

function validateTitle(str: string) {
  return str.trim().length > 0;
}

function validateUsers(users: Omit<UserInfo, 'password'>[]) {
  return users.length > 0;
}

export function validateRoom(
  name: keyof RoomCreateInfo,
  value: string | Omit<UserInfo, 'password'>[],
) {
  switch (name) {
    case 'title':
      return validateTitle(value as string);
    case 'users':
      return validateUsers(value as Omit<UserInfo, 'password'>[]);
    default:
      throw new Error(`Room property(${name}) is undefined`);
  }
}
