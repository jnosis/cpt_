import type { CorsOptions } from 'cors';
import type { ObjectId } from 'mongo';
import type { ParamsDictionary, RequestHandler } from 'opine';

export type BcryptOptions = {
  saltRound: number;
};

export type JwtOptions = {
  secretKey: string;
  expiresInSec: number;
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
  jwt: JwtOptions;
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

export type AuthToken = {
  token: string;
  username: string;
  userId: string;
};

export type Sentiment = 'positive' | 'negative' | 'neutral';

export type ChatData = {
  roomId: string;
  userId: string;
  message: string;
  sentiment: Sentiment;
  created_at: string;
};

export type RoomData = {
  id: string;
  title: string;
  users: Omit<UserData, 'password'>[];
  chats: ChatData[];
};

export type RoomCreateData = Omit<RoomData, 'id' | 'chats'>;

interface Model<Schema, Input, Data> {
  getAll(): Promise<Data[]>;
  findById(id: string): Promise<Data | undefined>;
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
  create(user: UserSignupData): Promise<string>;
}

export interface IUserController {
  getList: RequestHandler<ParamsDictionary, Omit<UserData, 'password'>[]>;
  signup: RequestHandler<ParamsDictionary, AuthToken>;
  login: RequestHandler<ParamsDictionary, AuthToken>;
  logout: RequestHandler;
  me: RequestHandler<ParamsDictionary, AuthToken>;
}

export interface RoomSchema {
  _id: ObjectId;
  title: string;
  users: Omit<UserData, 'password'>[];
  chats: ChatData[];
}

export interface RoomModel extends Model<RoomSchema, RoomCreateData, RoomData> {
  getAll(userId?: string): Promise<RoomData[]>;
  create(room: RoomCreateData): Promise<RoomData | undefined>;
  send(
    roomId: string,
    userId: string,
    message: string,
  ): Promise<ChatData | undefined>;
}

export interface IRoomController {
  getList: RequestHandler<ParamsDictionary, RoomData[]>;
  getById: RequestHandler<ParamsDictionary, RoomData>;
  create: RequestHandler<ParamsDictionary, RoomData>;
  update: RequestHandler<ParamsDictionary, RoomData>;
  delete: RequestHandler;
  send: RequestHandler<ParamsDictionary, ChatData>;
}
