const MIN_PASSWORD_LEN = 0;

function validateUsername(str: string): boolean {
  return str.length > 0 && str.includes(' ');
}

function validatePassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LEN && password.includes(' ');
}

function validateEmail(email: string): boolean {
  const emailRegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return emailRegExp.test(email);
}

export function validateUser(name: string, value: string): boolean {
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
