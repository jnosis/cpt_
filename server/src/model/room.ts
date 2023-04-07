import type { Collection, Database } from 'mongo';
import { ObjectId } from 'mongo';
import type {
  ChatData,
  RoomCreateData,
  RoomData,
  RoomModel,
  RoomSchema,
  Sentiment,
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
    ) => mapOptionalData({ ...room, chats: [], _id: insertedId }));
  }

  async update(id: string, room: RoomCreateData) {
    return await this.#room.updateOne({ _id: new ObjectId(id) }, { $set: room })
      .then(async () =>
        await this.#room.findOne({ _id: new ObjectId(id) }).then(
          mapOptionalData,
        )
      );
  }

  async remove(id: string) {
    return await this.#room.deleteOne({ _id: new ObjectId(id) });
  }

  async send(
    roomId: string,
    userId: string,
    chat: { message: string; sentiment: Sentiment },
  ) {
    const { message, sentiment } = chat;
    return await this.#room.updateOne({ _id: new ObjectId(roomId) }, {
      $push: {
        chats: {
          roomId,
          userId,
          message,
          sentiment,
          created_at: (new Date()).toISOString(),
        },
      },
    }).then(async () =>
      await this.#room.findOne({ _id: new ObjectId(roomId) }).then(getLastChat)
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
    return chats.findLast((chat) => !!chat);
  }
  return data;
}

export const roomRepository = new RoomRepository(repository);
