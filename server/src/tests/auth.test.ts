import { faker } from 'faker';
import { json, type Opine, opine } from 'opine';
import { SuperDeno, superdeno } from 'superdeno';
import { assertEquals, assertExists } from 'testing/asserts.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'testing/bdd.ts';
import { UserController } from '~/controller/auth.ts';
import { errorHandler } from '~/middleware/error_handler.ts';
import { userRepository } from '~/model/auth.ts';
import authRouter from '~/router/auth.ts';
import {
  clearCollection,
  createNewUser,
  createNewUsers,
  createToken,
  makeUserDetails,
} from '~/tests/auth_utils.ts';

describe('Auth APIs', () => {
  let app: Opine;
  let request: SuperDeno;

  beforeAll(() => {
    app = opine();
    app.use(json());
    app.use('/auth', authRouter(new UserController(userRepository)));
    app.use(errorHandler);

    request = superdeno(app);
  });

  beforeEach(async () => {
    await clearCollection();
  });

  afterAll(async () => {
    await clearCollection();
  });

  describe('POST to /auth/signup', () => {
    it('returns 201 and authorization token', async () => {
      const user = makeUserDetails();
      const response = await request.post('/auth/signup').send(user);

      assertEquals(response.status, 201);
    });

    it('returns 409 when username has already been taken', async () => {
      const user = makeUserDetails();
      const firstSignup = await request.post('/auth/signup').send(user);
      assertEquals(firstSignup.status, 201);

      const response = await request.post('/auth/signup').send(user);

      assertEquals(response.status, 409);
      assertEquals(response.body.message, `${user.username} already exists`);
    });

    it('returns 400 when username field is invalid', async () => {
      const user = makeUserDetails();
      const response = await request.post('/auth/signup').send({
        ...user,
        username: '',
      });

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Username should be not empty');
    });

    it('returns 400 when password field is invalid', async () => {
      const user = makeUserDetails();
      const response = await request.post('/auth/signup').send({
        ...user,
        password: '',
      });

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Password should be not empty');
    });

    it('returns 400 when email field is invalid', async () => {
      const user = makeUserDetails();
      const response = await request.post('/auth/signup').send({
        ...user,
        email: faker.random.alpha(13),
      });

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Invalid email');
    });
  });

  describe('GET to /auth/list', () => {
    it('returns all user list', async () => {
      const n = Math.floor(Math.random() * 5);
      const users = await createNewUsers(request, n);

      const response = await request.get('/auth/list');

      assertEquals(response.status, 200);
      assertEquals(response.body, users);
      assertEquals(response.body.length, n);
    });
  });

  describe('POST to /auth/login', () => {
    it('returns 200 and authorization token when login info are valid', async () => {
      const { username, password } = await createNewUser(request);

      const response = await request.post('/auth/login').send({
        username,
        password,
      });

      assertEquals(response.status, 200);
      assertExists(response.body.token);
    });

    it('returns 401 when username is not found', async () => {
      const wrongUsername = faker.internet.userName();
      const { password } = await createNewUser(request);

      const response = await request.post('/auth/login').send({
        username: wrongUsername,
        password,
      });

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Invalid username or password');
    });

    it('returns 401 when password is incorrect', async () => {
      const { username } = await createNewUser(request);
      const wrongPassword = faker.internet.password();

      const response = await request.post('/auth/login').send({
        username,
        password: wrongPassword,
      });

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Invalid username or password');
    });
  });

  describe('POST to /auth/logout', () => {
    it('returns 200 and removes cookie', async () => {
      await createNewUser(request);

      const response = await request.post('/auth/logout');

      assertEquals(response.status, 200);
      assertEquals(
        response.headers['set-cookie'],
        'token=; Secure; HttpOnly; SameSite=None; Path=/',
      );
      assertEquals(response.body.message, 'User has been logged out');
    });
  });

  describe('GET to /auth/me', () => {
    it('returns user details when valid token is present in Authorization header', async () => {
      const { id, username, token } = await createNewUser(request);

      const response = await request.get('/auth/me').set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 200);
      assertEquals(response.body, { username, token, userId: id });
    });

    it('returns user details when valid token is present in cookie', async () => {
      const { id, username, token, res } = await createNewUser(request);

      const { header } = res;

      const response = await request.get('/auth/me').set(
        'Cookie',
        [header['set-cookie'] as string],
      );

      assertEquals(response.status, 200);
      assertEquals(response.body, { username, token, userId: id });
    });

    it('returns 401 when token is not found', async () => {
      const response = await request.get('/auth/me');

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Authorization Error');
    });

    it('returns 401 when token is invalid', async () => {
      const response = await request.get('/auth/me').set({
        Authorization: `Bearer ${faker.datatype.string()}`,
      });

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Authorization Error');
    });

    it('returns 401 when user does not exist', async () => {
      const token = await createToken();
      const response = await request.get('/auth/me').set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Authorization Error');
    });
  });
});
