import { faker } from 'faker';
import { json, type Opine, opine } from 'opine';
import { SuperDeno, superdeno } from 'superdeno';
import { assertEquals, assertExists } from 'testing/asserts.ts';
import { afterAll, beforeAll, beforeEach, describe, it } from 'testing/bdd.ts';
import { UserController } from '~/controller/auth.ts';
import { RoomController } from '~/controller/room.ts';
import { errorHandler } from '~/middleware/error_handler.ts';
import { userRepository } from '~/model/auth.ts';
import { roomRepository } from '~/model/room.ts';
import authRouter from '~/router/auth.ts';
import roomRouter from '~/router/room.ts';
import {
  clearCollection as clearAuthCollection,
  createNewUser,
  createNewUsers,
} from '~/tests/auth_utils.ts';
import {
  clearCollection as clearRoomCollection,
  createNewRooms,
  makeRoomDetails,
} from '~/tests/room_utils.ts';

describe('Room APIs', () => {
  let app: Opine;
  let request: SuperDeno;

  beforeAll(() => {
    app = opine();
    app.use(json());
    app.use('/auth', authRouter(new UserController(userRepository)));
    app.use('/room', roomRouter(new RoomController(roomRepository)));
    app.use(errorHandler);

    request = superdeno(app);
  });

  beforeEach(async () => {
    await clearAuthCollection();
    await clearRoomCollection();
  });

  afterAll(async () => {
    await clearAuthCollection();
    await clearRoomCollection();
  });

  describe('POST to /room', () => {
    it('returns 201 and creates rooms', async () => {
      const {
        res: _r1,
        token,
        password: _pw1,
        ...user
      } = await createNewUser(request);
      const room = makeRoomDetails([user]);

      const response = await request.post('/room').set({
        Authorization: `Bearer ${token}`,
      }).send(room);

      const { title, users, chats } = response.body;
      const created = { title, users, chats };

      assertEquals({ ...created }, { ...room, chats: [] });
      assertEquals(response.status, 201);
    });

    it('returns 401 when authorization error', async () => {
      const users = await createNewUsers(request, 2);
      const room = makeRoomDetails(users);

      const response = await request.post('/room').send(room);

      assertEquals(response.status, 401);
      assertEquals(response.body.message, 'Authorization Error');
    });

    it('returns 400 when title field is invalid', async () => {
      const {
        res: _r,
        password: _pw,
        token,
        ...user
      } = await createNewUser(request);
      const room = makeRoomDetails([user]);

      const response = await request.post('/room').set({
        Authorization: `Bearer ${token}`,
      }).send({ ...room, title: '' });

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Title should be not empty');
    });

    it('returns 400 when users field is invalid', async () => {
      const { token } = await createNewUser(request);
      const room = makeRoomDetails([]);

      const response = await request.post('/room').set({
        Authorization: `Bearer ${token}`,
      }).send(room);

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Users should be at least one');
    });
  });

  describe('GET to /room', () => {
    it('returns all user list', async () => {
      const n = Math.floor(Math.random() * 5);
      const { rooms, token } = await createNewRooms(request, n);

      const response = await request.get('/room').set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 200);
      assertEquals(response.body, rooms);
      assertEquals(response.body.length, n);
    });
  });

  describe('GET to /room/:id', () => {
    it('returns 404 when room does not exist', async () => {
      const { token } = await createNewUser(request);
      const id = faker.database.mongodbObjectId();

      const response = await request.get(`/room/${id}`).set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 404);
      assertExists(response.body.message, `Room id(${id}) not found`);
    });

    it('returns 401 when user does not in room', async () => {
      const { token } = await createNewUser(request);
      const { rooms } = await createNewRooms(request);
      const room = rooms[0];

      const response = await request.get(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 401);
      assertExists(response.body.message, 'Authorization Error');
    });

    it('returns 200 and the room object when room exists', async () => {
      const { token, rooms } = await createNewRooms(request);
      const room = rooms[0];

      const response = await request.get(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 200);
      assertEquals(response.body, { ...room });
    });
  });

  describe('PUT to /room/:id', () => {
    it('returns 404 when room does not exist', async () => {
      const {
        res: _r1,
        token,
        password: _pw1,
        ...user
      } = await createNewUser(request);
      const id = faker.database.mongodbObjectId();
      const updated = makeRoomDetails([user]);

      const response = await request.put(`/room/${id}`).set({
        Authorization: `Bearer ${token}`,
      }).send(updated);

      assertEquals(response.status, 404);
      assertExists(response.body.message, `Room id(${id}) not found`);
    });

    it('returns 401 when user does not in room', async () => {
      const { token } = await createNewUser(request);
      const { rooms } = await createNewRooms(request);
      const room = rooms[0];
      const updated = makeRoomDetails(room.users);

      const response = await request.put(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      }).send(updated);

      assertEquals(response.status, 401);
      assertExists(response.body.message, 'Authorization Error');
    });

    it('returns 200 and the room object when room exists', async () => {
      const { token, rooms } = await createNewRooms(request);
      const room = rooms[0];
      const updated = makeRoomDetails(room.users);

      const response = await request.put(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      }).send(updated);

      assertEquals(response.status, 200);
      assertEquals(response.body, { ...room, ...updated });
    });
  });

  describe('DELETE to /room/:id', () => {
    it('returns 404 when work does not exist', async () => {
      const { token } = await createNewUser(request);
      const id = faker.database.mongodbObjectId();

      const response = await request.delete(`/room/${id}`).set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 404);
      assertEquals(response.body.message, `Room id(${id}) not found`);
    });

    it('returns 204 and the work should be deleted when work exists', async () => {
      const { token, rooms } = await createNewRooms(request);
      const room = rooms[0];

      const response = await request.delete(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      });

      assertEquals(response.status, 204);
    });
  });

  describe('POST to /room/:id', () => {
    it('returns 400 when message field is invalid', async () => {
      const { token, rooms } = await createNewRooms(request);
      const room = rooms[0];

      const response = await request.post(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      }).send({ message: '' });

      assertEquals(response.status, 400);
      assertEquals(response.body.message, 'Message should be not empty');
    });

    it('returns 201 and sent chat data', async () => {
      const { token, rooms, user } = await createNewRooms(request);
      const room = rooms[0];
      const chat = {
        roomId: room.id,
        userId: user.id,
        message: faker.lorem.sentence(),
        sentiment: 'neutral',
      };

      const response = await request.post(`/room/${room.id}`).set({
        Authorization: `Bearer ${token}`,
      }).send({ message: chat.message });
      const {
        roomId,
        userId,
        message,
        sentiment,
      } = response.body;
      const sent = {
        roomId,
        userId,
        message,
        sentiment,
      };

      assertEquals(response.status, 201);
      assertEquals({ ...sent }, { ...chat });
    });
  });
});
