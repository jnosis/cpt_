import { faker } from 'faker';
import { SuperDeno } from 'superdeno';
import type { UserData, UserSignupData } from '~/types.ts';
import { createJwtToken } from '~/helper/jwt.ts';
import mongodb from '~/mongodb.ts';

export async function clearCollection() {
  return await mongodb.getDatabase.collection('auth').deleteMany({});
}

export function makeUserDetails(): UserSignupData {
  return {
    username: faker.name.middleName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}

export async function createNewUser(request: SuperDeno) {
  const user = makeUserDetails();
  const createdUser = await request.post('/auth/signup').send(user);
  return {
    ...user,
    id: createdUser.body.userId,
    token: createdUser.body.token,
    res: createdUser,
  };
}

export async function createNewUsers(request: SuperDeno, n = 1) {
  let users: Omit<UserData, 'password'>[] = [];
  let cnt = 0;

  while (cnt++ < n) {
    const { password: _password, token: _token, res: _res, ...user } =
      await createNewUser(request);
    users = [...users, user];
  }
  return users;
}

export async function createToken() {
  return await createJwtToken(faker.database.mongodbObjectId());
}
