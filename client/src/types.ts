export interface IHttpClient {
  fetch<Data>(url: string, options: RequestInit): Promise<Data>;
}

export interface IAuthApi {
  signup(user: SignUpInfo): Promise<AuthToken>;
  login(loginInfo: LoginInfo): Promise<AuthToken>;
  logout(): Promise<void>;
  me(): Promise<AuthToken>;
}

export type UserInfo = {
  id: string;
  email: string;
  username: string;
  password: string;
};

export type SignUpInfo = Omit<UserInfo, 'id'>;

export type LoginInfo = Pick<UserInfo, 'username' | 'password'>;

export type AuthToken = {
  token: string;
  username: string;
  userId: string;
};
