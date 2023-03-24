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

export interface IUserController {
  getList: RequestHandler<ParamsDictionary, Omit<UserData, 'password'>[]>;
  signup: RequestHandler<ParamsDictionary, AuthToken>;
  login: RequestHandler<ParamsDictionary, AuthToken>;
  logout: RequestHandler;
  me: RequestHandler<ParamsDictionary, AuthToken>;
}
