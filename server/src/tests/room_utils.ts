import { faker } from 'faker';
import type { SuperDeno } from 'superdeno';
import type { RoomCreateData, RoomData, UserData } from '~/types.ts';
import { createNewUser, createNewUsers } from '~/tests/auth_utils.ts';
import mongodb from '~/mongodb.ts';

export async function clearCollection() {
  return await mongodb.getDatabase.collection('room').deleteMany({});
}

export function makeRoomDetails(
  users: Omit<UserData, 'password'>[],
): RoomCreateData {
  return {
    title: faker.commerce.product(),
    users,
  };
}

export async function createNewRooms(request: SuperDeno, n = 1) {
  const {
    res: _res,
    token,
    password: _pw,
    ...user
  } = await createNewUser(request);
  let rooms: RoomData[] = [];
  let cnt = 0;

  while (cnt++ < n) {
    const users = [...(await createNewUsers(request)), user];
    const room = makeRoomDetails(users);
    const response = await request.post('/room').set({
      Authorization: `Bearer ${token}`,
    }).send(room);
    const id = response.body.id;
    rooms = [...rooms, { ...room, id, chats: [] }];
  }
  return {
    rooms,
    user,
    token,
  };
}
