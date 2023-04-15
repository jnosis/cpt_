import type {
  AuthToken,
  IAuthApi,
  IHttpClient,
  LoginInfo,
  SignUpInfo,
} from '../types';

export default class AuthApi implements IAuthApi {
  #http: IHttpClient;
  constructor(http: IHttpClient) {
    this.#http = http;
  }

  async signup(user: SignUpInfo): Promise<AuthToken> {
    const { username, password, email } = user;
    return await this.#http.fetch<AuthToken>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  }

  async login(loginInfo: LoginInfo): Promise<AuthToken> {
    const { username, password } = loginInfo;
    return await this.#http.fetch<AuthToken>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return await this.#http.fetch<void>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async me(): Promise<AuthToken> {
    return await this.#http.fetch<AuthToken>('/api/auth/me', {
      method: 'GET',
    });
  }
}
