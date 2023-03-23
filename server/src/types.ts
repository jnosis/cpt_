import type { CorsOptions } from 'cors';
import type { ObjectId } from 'mongo';

export type BcryptOptions = {
  saltRound: number;
};

export type MongodbOptions = {
  name: string;
  host: string;
};

export type RateLimitOptions = {
  windowMs: number;
  maxRequest: number;
};

export type Config = {
  bcrypt: BcryptOptions;
  cors: CorsOptions;
  mongodb: MongodbOptions;
  rateLimit: RateLimitOptions;
};

export type UserData = {
  id: string;
  email: string;
  username: string;
  password: string;
};

export type UserSignupData = Omit<UserData, 'id'>;

interface Model<Schema, Input, Data> {
  getAll(): Promise<Data[]>;
  create(input: Input): Promise<(Data | undefined) | string>;
  update(
    key: string,
    input: Input,
    isAuth?: boolean,
  ): Promise<Data | undefined>;
  remove(key: string, isAuth?: boolean): Promise<number>;
}

export interface UserSchema {
  _id: ObjectId;
  email: string;
  username: string;
  password: string;
}

export interface UserModel extends Model<UserSchema, UserSignupData, UserData> {
  findByUsername(username: string): Promise<UserData | undefined>;
  findById(id: string): Promise<UserData | undefined>;
  create(user: UserSignupData): Promise<string>;
}
