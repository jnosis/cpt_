import type { Collection, Database } from 'mongo';
import { ObjectId } from 'mongo';
import type {
  UserData,
  UserModel,
  UserSchema,
  UserSignupData,
} from '~/types.ts';
import mongodb from '~/mongodb.ts';

const repository = mongodb.getDatabase;

class UserRepository implements UserModel {
  #user: Collection<UserSchema>;
  constructor(db: Database) {
    this.#user = db.collection<UserSchema>('auth');
  }

  async getAll() {
    return await this.#user.find().toArray().then((users) =>
      users.map(mapOptionalData).filter((user): user is UserData => !!user)
    );
  }

  async findByUsername(username: string) {
    return await this.#user.findOne({ username }).then(mapOptionalData);
  }

  async findById(id: string) {
    return await this.#user.findOne({ _id: new ObjectId(id) }).then(
      mapOptionalData,
    );
  }

  async create(user: UserSignupData) {
    return await this.#user.insertOne(user).then((insertedId) =>
      insertedId.toString()
    );
  }

  async update(username: string, user: UserSignupData) {
    return await this.#user.updateOne({ username }, { $set: user }).then(
      async () => await this.#user.findOne({ username }).then(mapOptionalData),
    );
  }

  async remove(username: string) {
    return await this.#user.deleteOne({ username });
  }
}

function mapOptionalData(data?: UserSchema): UserData | undefined {
  return data ? { ...data, id: data._id.toString() } : data;
}

export const userRepository = new UserRepository(repository);
