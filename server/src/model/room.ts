import type { Collection, Database } from 'mongo';
import { ObjectId } from 'mongo';
import type {
  ChatData,
  RoomCreateData,
  RoomData,
  RoomModel,
  RoomSchema,
} from '~/types.ts';
import mongodb from '~/mongodb.ts';

const repository = mongodb.getDatabase;

class RoomRepository implements RoomModel {
  #room: Collection<RoomSchema>;
  constructor(db: Database) {
    this.#room = db.collection<RoomSchema>('room');
  }

  async getAll(userId?: string) {
    return await this.#room.find().toArray().then((rooms) =>
      rooms.map(mapOptionalData)
        .filter((room): room is RoomData => !!room)
        .filter((room) =>
          userId ? room.users.map((user) => user.id).includes(userId) : room
        )
    );
  }

  async findById(id: string) {
    return await this.#room.findOne({ _id: new ObjectId(id) }).then(
      mapOptionalData,
    );
  }

  async create(room: RoomCreateData) {
    return await this.#room.insertOne({ ...room, chats: [] }).then((
      insertedId,
    ) => insertedId.toString());
  }

  async update(id: string, room: RoomCreateData) {
    return await this.#room.updateOne({ id }, { $set: room }).then(
      async () => await this.#room.findOne({ id }).then(mapOptionalData),
    );
  }

  async remove(id: string) {
    return await this.#room.deleteOne({ id });
  }

  async send(roomId: string, userId: string, message: string) {
    return await this.#room.updateOne({ id: roomId }, {
      $push: {
        chats: {
          roomId,
          userId,
          message,
          sentiment: 'neutral',
          created_at: (new Date()).toISOString(),
        },
      },
    }).then(async ({ upsertedId }) =>
      await this.#room.findOne({ id: upsertedId }).then(getLastChat)
    );
  }
}

function mapOptionalData(data?: RoomSchema): RoomData | undefined {
  if (data) {
    const { _id, ...room } = data;
    return { ...room, id: data._id.toString() };
  }
  return data;
}

function getLastChat(data?: RoomSchema): ChatData | undefined {
  if (data) {
    const { chats } = data;
    return chats[-1];
  }
  return data;
}

export const roomRepository = new RoomRepository(repository);